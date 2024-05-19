import React, { useEffect, useState } from "react";
import Modal from "./components/Modal";
import axios from "axios";

const App = () => {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [taskList, setTaskList] = useState([]);
  const [modal, setModal] = useState(false);

  const refreshList = () => {
    axios //Axios to send and receive HTTP requests
      .get("http://localhost:8000/api/tasks/")
      .then((res) => setTaskList(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    refreshList();
  }, []);

  const displayCompleted = (status) => {
    if (status) {
      return setViewCompleted(true);
    }
    return setViewCompleted(false);
  };

  const renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => displayCompleted(true)}
          className={viewCompleted ? "active" : ""}
        >
          completed
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={viewCompleted ? "" : "active"}
        >
          Incompleted
        </span>
      </div>
    );
  };

  // Main variable to render items on the screen
  const renderItems = () => {
    const newItems = taskList.filter(
      (item) => item.completed === viewCompleted
    );
    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${viewCompleted ? "completed-todo" : ""}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => editItem(item)}
            className="btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button onClick={() => handleDelete(item)} className="btn btn-danger">
            Delete
          </button>
        </span>
      </li>
    ));
  };

  ////add this after modal creation
  const toggle = () => {
    //add this after modal creation
    setModal(!modal);
  };

  // Submit an item
  const handleSubmit = (item) => {
    toggle();
    if (item.id) {
      // if old post to edit and submit
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then((res) => refreshList());
      return;
    }
    // if new post to submit
    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then((res) => refreshList());
  };

  // Delete item
  const handleDelete = (item) => {
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then((res) => refreshList());
  };

  // Create item
  const createItem = () => {
    const item = { title: "", description: "", completed: false };
    setActiveItem(item);
    setModal(!modal);
  };

  //Edit item
  const editItem = (item) => {
    setActiveItem(item);
    setModal(!modal);
  };

  return (
    <main className="content">
      <h1 className="text-black text-uppercase text-center my-4">
        Task Manager
      </h1>
      <div className="row ">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="">
              <button onClick={createItem} className="btn btn-primary">
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush">{renderItems()}</ul>
          </div>
        </div>
      </div>
      {modal ? (
        <Modal
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      ) : null}
    </main>
  );
};
export default App;
