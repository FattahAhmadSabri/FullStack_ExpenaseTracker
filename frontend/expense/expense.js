const api = "http://localhost:4000/expense";

const handleExpense = async (event) => {
  event.preventDefault();
  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  try {
    const response = await axios.post(`${api}/add`, {
      amount,
      description,
      category,
    });
    console.log(response.data);
    display([response.data.data]);
    event.target.reset();
  } catch (error) {
    console.log(error);
  }
};

const getData = async () => {
  try {
    const response = await axios.get(api);
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
    li.textContent = `${item.amount}   ${item.description}   ${item.category}`;
    li.appendChild(deleteButton);
    ul.appendChild(li);
  });
};

window.onload = async () => {
  const data = await getData();

  display(data);
};
