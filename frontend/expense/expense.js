const api = "http://localhost:4000/expense";

const handleExpense = async (event) => {
  event.preventDefault();
  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${api}/add`,
      {
        amount,
        description,
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

let currentPage = 1;
const limit = 5;

const getData = async (page = currentPage) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${api}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    currentPage = page;

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const display = (data) => {
  const ul = document.querySelector("ul");
  ul.innerHTML = "";

  data.forEach((item) => {
    const li = document.createElement("li");
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete Button";
    deleteButton.onclick = () => {
      deleteExpense(item.id, li);
    };

    li.textContent = `${item.amount} - ${item.description} - ${item.category} - `;
    li.appendChild(deleteButton);

    ul.appendChild(li);
  });
};

const getPremiumData = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${api}/premium`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getpremiumDisplay = (data) => {
  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "";

  data.forEach((item) => {
    const li = document.createElement("li");

    li.textContent = `Name: ${item.name} - Total Expense- ${item.totalExpense}`;

    leaderboard.appendChild(li);
  });
};

const handleLeaderboard = async () => {
  const data = await getPremiumData();
  getpremiumDisplay(data);
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

const showPagination = (pagination) => {
  const div = document.getElementById("pagination");
  div.innerHTML = "";

  if (pagination.hasPreviousPage) {
    const prev = document.createElement("button");
    prev.innerText = "Previous";
    prev.onclick = async () => {
      const response = await getData(pagination.previousPage);
      display(response.expenses);
      showPagination(response.pagination);
    };
    div.appendChild(prev);
  }

  if (pagination.hasNextPage) {
    const next = document.createElement("button");
    next.innerText = "Next";
    next.onclick = async () => {
      const response = await getData(pagination.nextPage);
      display(response.expenses);
      showPagination(response.pagination);
    };
    div.appendChild(next);
  }
};

const handlepayments = () => {
  return (window.location.href = "../payments/payments.html");
};
const handleDayByDayExpenses = () => {
  return (window.location.href = "./dayByDayExpense.html");
};

window.onload = async () => {
  const response = await getData();

  display(response.expenses);
  showPagination(response.pagination);
};
