import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../slices/loginSlice.js';
import axiosInstance from '../../../api/axiosInstance.js';
import {
  CgSmartHomeRefrigerator,
  CgList,
  CgProfile,
  CgLogIn
} from 'react-icons/cg';
import NavItem from './NavItem.jsx';
import { BiBlanket } from 'react-icons/bi';
import ProfileDropdown from './ProfileDropdown.jsx';
import { HEADER_STYLES } from '../../../common/styles/Header';

function Header({ isBlocked = false }) {
  const loginState = useSelector((state) => state.loginSlice);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleSseError = useCallback(() => {
    if (!isReconnecting) {
      setIsReconnecting(true);
      setTimeout(() => {
        setIsReconnecting(false);
      }, 3000);
    }
  }, [isReconnecting]);

  // SSE 구독 설정
  useEffect(() => {
    let eventSource = null;

    if (loginState.isLoggedIn) {
      const baseUrl = import.meta.env.VITE_HOST || '';
      eventSource = new EventSource(
        `${baseUrl}/api/user/notification/subscribe`,
        { withCredentials: true }
      );

      const eventName = 'USER_NOTIFICATION_EVENT';

      eventSource.addEventListener(eventName, (event) => {
        const eventData = JSON.parse(event.data);
        setNotifications((prev) => [...prev, eventData]);
      });

      eventSource.onerror = () => {
        eventSource.close();
        handleSseError();
      };
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [loginState.isLoggedIn, handleSseError]);

  const handleUnsavedChanges = (isBlocked) => {
    if (isBlocked) {
      return window.confirm(
        '작성 중인 내용을 저장하지 않고 이동하시겠습니까?',
      );
    }
    return true;
  };

  const handleLogout = async () => {
    if (!handleUnsavedChanges(isBlocked)) {
      return;
    }
    try {
      navigate('/'); // 로그아웃 전 루트로 이동 (unauthenticated 페이지 방지)
      await axiosInstance.post('/api/logout');
      dispatch(logout());
    } catch (error) {
      console.error('로그아웃 실패:', error.response?.data || error.message);
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLinkClick = (path) => {
    if (!handleUnsavedChanges(isBlocked)) {
      return;
    }
    navigate(path);
  };

  if (!loginState.isInitialized) {
    return null;
  }

  return (
    <header className={HEADER_STYLES.header}>
      <div className={HEADER_STYLES.headerContainer}>
        <div className={HEADER_STYLES.logoContainer}>
          <img
            src="/logo.png"
            alt="냉파고"
            className={HEADER_STYLES.logo}
            onClick={() => handleLinkClick('/')}
          />
        </div>
        <div className={HEADER_STYLES.navContainer}>
          {loginState.isLoggedIn && (
            <>
            <NavItem
              to="/refrigerator"
              isActive={isActive('/refrigerator')}
              label="냉장고"
              Icon={CgSmartHomeRefrigerator}
              onClick={() => handleLinkClick('/refrigerator')}
            />
            <NavItem
                to="/user-recipe"
                isActive={isActive('/user-recipe')}
                label="유저 레시피"
                Icon={BiBlanket}
                onClick={() => handleLinkClick('/user-recipe/list')}
              />
              </>
          )}
          <NavItem
            to="/community"
            isActive={isActive('/community')}
            label="커뮤니티"
            Icon={CgList}
            onClick={() => handleLinkClick('/community')}
          />
          {loginState.isLoggedIn ? (
            <ProfileDropdown
              isActive={isActive('/my-page')}
              Icon={CgProfile}
              nickname={loginState.nickname}
              notifications={notifications}
              onLogout={handleLogout}
              onLinkClick={handleLinkClick}
            />
          ) : (
            <NavItem
              to="/login"
              isActive={isActive('/login')}
              label="로그인"
              Icon={CgLogIn}
              onClick={() => handleLinkClick('/login')}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
