import "./Notifications.css";

const notifications = [
  {
    id: 1,
    title: "New Notes Uploaded",
    message: "DBMS Unit-5 Notes were uploaded today.",
    color: "blue",
  },
  {
    id: 2,
    title: "Assignment Reminder",
    message: "Submit your DBMS Assignment before Friday.",
    color: "orange",
  },
  {
    id: 3,
    title: "Lab Manual Added",
    message: "Operating Systems Lab Manual is now available.",
    color: "green",
  },
  {
    id: 4,
    title: "Admin Announcement",
    message: "Mid-1 timetable has been updated.",
    color: "pink",
  },
];

const Notifications = () => {
  return (
    <div className="notifications-card">

      <h2>🔔 Notifications</h2>

      <div className="notification-list">

        {notifications.map((item) => (

          <div
            key={item.id}
            className={`notification ${item.color}`}
          >

            <h4>{item.title}</h4>

            <p>{item.message}</p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Notifications;