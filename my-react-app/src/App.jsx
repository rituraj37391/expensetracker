import { useMemo, useState } from "react";
import "./App.css";

const initialForm = {
  description: "",
  date: "",
  category: "",
  amount: "",
};

const categoryColors = {
  Food: "#f29b63",
  Travel: "#6b9ce7",
  Shopping: "#b28ae3",
  Bills: "#e5c34e",
  Other: "#63b58a",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = Number(form.amount);
    if (!form.description.trim() || !form.date || !form.category || !Number.isFinite(amount) || amount <= 0) {
      alert("Saari fields bharo aur amount zero se zyada daalo");
      return;
    }

    setExpenses((prev) => [
      ...prev,
      { ...form, id: Date.now(), description: form.description.trim(), amount },
    ]);
    setForm(initialForm);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryTotals = useMemo(() => {
    const totals = expenses.reduce((grouped, expense) => {
      grouped.set(expense.category, (grouped.get(expense.category) ?? 0) + expense.amount);
      return grouped;
    }, new Map());

    return [...totals.entries()]
      .map(([category, amount]) => ({
        category,
        amount,
        color: categoryColors[category] ?? categoryColors.Other,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  let chartAngle = 0;
  const chartGradient = categoryTotals.length
    ? `conic-gradient(${categoryTotals
        .map(({ amount, color }) => {
          const start = chartAngle;
          chartAngle += (amount / total) * 360;
          return `${color} ${start}deg ${chartAngle}deg`;
        })
        .join(", ")})`
    : undefined;
  const topCategory = categoryTotals[0]?.category ?? "—";

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Your money, in focus</p>
          <h1>Expense tracker</h1>
          <p className="page-subtitle">Track your spending and see where it goes.</p>
        </div>
        <span className="header-badge">Personal dashboard</span>
      </header>

      <section className="summary-grid" aria-label="Expense summary">
        <article className="summary-card">
          <span className="summary-label">Total expenses</span>
          <strong className="summary-value">{formatCurrency(total)}</strong>
          <span className="summary-note">Across all categories</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Transactions</span>
          <strong className="summary-value">{expenses.length}</strong>
          <span className="summary-note">Expenses recorded</span>
        </article>
        <article className="summary-card">
          <span className="summary-label">Top category</span>
          <strong className="summary-value">{topCategory}</strong>
          <span className="summary-note">{categoryTotals.length ? "Highest spend so far" : "Add an expense to get started"}</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="panel form-panel">
          <div className="panel-heading">
            <div>
              <h2>Add an expense</h2>
              <p>Keep your spending log up to date.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="expense-form">
            <label className="form-field form-field--wide">
              Description
              <input
                type="text"
                name="description"
                placeholder="e.g. Chai, Petrol"
                value={form.description}
                onChange={handleChange}
                required
              />
            </label>
            <label className="form-field">
              Date
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>
            <label className="form-field">
              Category
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="" disabled>Select category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="form-field form-field--wide">
              Amount
              <input
                type="number"
                name="amount"
                min="0.01"
                step="0.01"
                placeholder="₹ 0.00"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit" className="submit-button">Add expense</button>
          </form>
        </div>

        <section className="panel chart-panel" aria-labelledby="category-chart-title">
          <div className="panel-heading">
            <div>
              <h2 id="category-chart-title">Spending by category</h2>
              <p>How your expenses are distributed.</p>
            </div>
          </div>
          {categoryTotals.length ? (
            <div className="chart-content">
              <div
                className="pie-chart"
                role="img"
                aria-label={`Category expense chart. Total ${formatCurrency(total)}.`}
                style={{ "--chart-gradient": chartGradient }}
              >
                <div className="pie-center">
                  <strong className="pie-total">{formatCurrency(total)}</strong>
                  <span className="pie-caption">total spent</span>
                </div>
              </div>
              <div className="category-legend" aria-label="Category totals">
                {categoryTotals.map(({ category, amount, color }) => (
                  <div className="legend-item" key={category}>
                    <span className="legend-dot" style={{ "--category-color": color }} />
                    <span className="legend-name">{category}</span>
                    <span className="legend-amount">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-chart">Your category breakdown will show up here.</div>
          )}
        </section>
      </section>

      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent expenses</h2>
            <p>A clear view of everything you have added.</p>
          </div>
          <span className="expense-count">{expenses.length} {expenses.length === 1 ? "entry" : "entries"}</span>
        </div>
        <div className="table-wrap">
          <table className="expense-table">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Date</th>
                <th scope="col">Category</th>
                <th scope="col">Amount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="5">No expenses yet. Add one above to get started.</td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="expense-description">{expense.description}</td>
                    <td>{expense.date}</td>
                    <td>
                      <span className="category-pill" style={{ "--category-color": categoryColors[expense.category] ?? categoryColors.Other }}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="expense-amount">{formatCurrency(expense.amount)}</td>
                    <td>
                      <button className="delete-button" type="button" onClick={() => deleteExpense(expense.id)} aria-label={`Delete ${expense.description}`}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">Total</td>
                <td className="total-amount" colSpan="2">{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </main>
  );
}

export default App;