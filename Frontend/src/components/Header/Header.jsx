import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import api from '../../api';

export default function Header() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [users, setUsers] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/api/get_users/');
      const data = {};
      response.data.forEach(user => {
        data[user.id] = user.username;
      });
      setUsers(data);
    }

    fetchData()
    }, []);

    // get the loggedin user id
    const user_id = users ? Object.keys(users).find(key => users[key] === loggedInUser) : null;
    
  const navItems = [
    {
      name: "Home",
      route: "/",
      show: true
    },
    {
      name: "Profile",
      route: "/profile/" + user_id,

      show: isAuthenticated
    },
    {
      name: "Create Post",
      route: "/create_post",
      show: isAuthenticated
    },
    {
      name: "Login",
      route: "/login",
      show: !isAuthenticated
    },
    {
      name: "Logout",
      route: "/logout",
      show: isAuthenticated
    },
    {
      name: "Register",
      route: "/register",
      show: !isAuthenticated
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">MyApp</Link>
        </div>
        <ul className="flex space-x-4">
          {navItems.filter(item => item.show).map((item, index) => (
            <li key={index} className={`${location.pathname === item.route ? 'border-b-2 border-white' : ''}`}>
              {item.name === "Logout" ? (
                <button onClick={handleLogout} className="hover:text-gray-400 transition duration-200">
                  {item.name}
                </button>
              ) : (
                <Link to={item.route} className="hover:text-gray-400 transition duration-200">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
