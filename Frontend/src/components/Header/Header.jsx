import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import api from '../../api';
import logo from '../../assets/logo.png'; // Update the path to your logo image
import { FaHome, FaUser, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaPen } from 'react-icons/fa';

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

    fetchData();
  }, []);

  const user_id = users ? Object.keys(users).find(key => users[key] === loggedInUser) : null;

  const navItems = [
    {
      name: "Home",
      route: "/",
      icon: <FaHome />,
      show: true
    },
    {
      name: "Profile",
      route: `/profile/${user_id}`,
      icon: <FaUser />,
      show: isAuthenticated
    },
    {
      name: "Create Post",
      route: "/create_post",
      icon: <FaPen />,
      show: isAuthenticated
    },
    {
      name: "Login",
      route: "/login",
      icon: <FaSignInAlt />,
      show: !isAuthenticated
    },
    {
      name: "Logout",
      route: "/logout",
      icon: <FaSignOutAlt />,
      show: isAuthenticated
    },
    {
      name: "Register",
      route: "/register",
      icon: <FaUserPlus />,
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
        <div className="flex items-center">
          <img src={logo} alt="BlissBuzz Logo" className="h-8 w-8 mr-2" />
          <div className="text-2xl font-bold">
            <Link to="/">BlissBuzz</Link>
          </div>
        </div>
        <ul className="flex space-x-10">
          {navItems.filter(item => item.show).map((item, index) => (
            <li key={index} className={`${location.pathname === item.route ? 'border-b-2 border-white' : ''}`}>
              {item.name === "Logout" ? (
                <button onClick={handleLogout} className="flex items-center hover:text-gray-400 transition duration-200">
                  {item.icon}
                  <span className="ml-1">{item.name}</span>
                </button>
              ) : (
                <Link to={item.route} className="flex items-center hover:text-gray-400 transition duration-200">
                  {item.icon}
                  <span className="ml-1">{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
