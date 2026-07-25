import {
  FaBell,
  FaCheckDouble
} from "react-icons/fa";

import "./NotificationDropdown.css";


export default function NotificationDropdown({
  notifications,
  onNotificationClick,
  onMarkAllRead
}) {


return (

<div className="notification-dropdown">


{/* HEADER */}

<div className="notification-header">

<div>

<h3>
<FaBell/>
 Notifications
</h3>

<p>
EduVault Updates
</p>

</div>


{
notifications.some(
(item)=>!item.read
)
&&

<button
className="mark-all-btn"
onClick={onMarkAllRead}
>

<FaCheckDouble/>
 Read All

</button>

}


</div>





{/* LIST */}

<div className="notification-list">


{
notifications.length > 0 ?

notifications.map((item)=>(


<button

key={item._id}

className={
`notification-item ${
!item.read ? "unread": ""
}`
}


onClick={()=>
onNotificationClick(item)
}

>


<div className="notification-icon">

📚

</div>



<div>

<h4>

{item.title}

</h4>


<p>

{item.message}

</p>


<span>

{
new Date(
item.createdAt
).toLocaleString()
}

</span>


</div>


</button>


))


:

<div className="empty-notification">

🔕

<h4>
No Notifications
</h4>

<p>
You are updated!
</p>

</div>


}


</div>



</div>

);

}