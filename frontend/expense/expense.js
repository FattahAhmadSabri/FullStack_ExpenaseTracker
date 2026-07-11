const api = "http://localhost:4000/expense";

const handleExpense = async (event) => {
  event.preventDefault();
  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${api}/add`,
      {
        amount,
        description,
        category,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
    display([response.data.data]);
    event.target.reset();
  } catch (error) {
    console.log(error);
  }
};

const getData = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const display = (data) => {
  data.forEach((item) => {
    const ul = document.querySelector("ul");
    const li = document.createElement("li");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Button";
    deleteButton.onclick = () => {
      deleteExpense(item.id, li);
    };
    li.textContent = `${item.amount}   ${item.description}   ${item.category}`;
    li.appendChild(deleteButton);
    ul.appendChild(li);
  });
};

const deleteExpense = async (id, li) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${api}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    li.remove();
  } catch (error) {
    console.log(error);
  }
};
window.onload = async () => {
  const data = await getData();

  display(data);
};
