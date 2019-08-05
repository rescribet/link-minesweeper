import classNames from 'classnames';
import { NamedNode, Namespace } from 'rdflib'
import { register, useLRS } from 'link-redux'
import React from 'react';
import { confirmKeyUpHandler } from '../../helpers/input'

import { DEFAULT_TOPOLOGY, defaultNS as NS } from 'link-lib'

const TodoItem = ({
  completed,
  subject,
  text,
  todoList,
}) => {
  const lrs = useLRS();
  const [editing, setEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(null);


  const className = classNames({
    completed: completed?.value === "true",
    editing,
  })

  const handleKeyUp = confirmKeyUpHandler(
    (value) => lrs.actions.todo.update(todoList, subject, value),
    setEditing,
    setEditText
  )

  return (
    <li className={className}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={completed?.value === "true"}
          // This too, we'd get from the server as a `http://schema.org/potentialAction` property
          // (yes, the same model as gmail actions).
          onChange={() => lrs.actions.todo.toggle(todoList, subject)}
        />
        <label
          style={{ minHeight: '1em' }}
          onDoubleClick={() => setEditing(true)}
        >
          {text.value}
        </label>
        <button className="destroy" onClick={() => lrs.actions.todo.remove(subject)} />
      </div>
      <input
        autoFocus
        className={"edit"}
        onKeyUp={handleKeyUp}
        onChange={(e) => setEditText(e.target.value)}
        value={editing ? editText : text.value}
      />
    </li>
  );
};

TodoItem.type = Namespace("https://fletcher91.github.io/link-redux-todo/")('TodoItem');

TodoItem.topology = [
  undefined,
  DEFAULT_TOPOLOGY,
  NamedNode.find("http://localhost:8080/article"),
  new NamedNode.find("https://ontola-mash.herokuapp.com/article"),
];


TodoItem.mapDataToProps = [NS.schema('text'), Namespace("https://fletcher91.github.io/link-redux-todo/")('completed')];

export default register(TodoItem);
