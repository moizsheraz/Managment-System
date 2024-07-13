import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import api from '../../api';
import logo from '../../assets/logo.png'; // Update the path to your logo image
import { FaHome, FaUser, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaPen, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [users, setUsers] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
      name: "Users",
      route: '/users',
      icon: <FaUser />,
      show: true
    },
    {
      name: "Create Post",
      route: "/create_post",
      icon: <FaPen />,
      show: isAuthenticated
    },
    {
      name: "Profile",
      route: `/profile/${user_id}`,
      icon: <FaUser />,
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center relative">
        <div className="flex items-center">
          <img src={logo} alt="BlissBuzz Logo" className="h-8 w-8 mr-2" />
          <div className="text-2xl font-bold">
            <Link to="/">BlissBuzz</Link>
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
        <ul className={`md:flex md:space-x-10 absolute md:static top-12 -right-4 bg-gray-800 md:bg-transparent z-10 ${menuOpen ? 'block' : 'hidden'} md:flex-row flex-col space-y-4 md:space-y-0 p-4 md:p-0 w-auto`}>
          {navItems.filter(item => item.show).map((item, index) => (
            <li key={index} className={`flex justify-center ${location.pathname === item.route ? 'border-b-2 border-white' : ''}`}>
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
