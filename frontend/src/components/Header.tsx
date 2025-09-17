'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useMemo } from 'react';
import { FaBell, FaChevronDown, FaUser, FaSignOutAlt } from 'react-icons/fa';
import styles from '@/styles/Header.module.css';

const pageTitles: Record<string, string> = {
  '/': 'T',
  '/dashboard': 'TRANG CHỦ',
  '/authors': 'QUẢN LÝ TÁC GIẢ',
  '/books': 'QUẢN LÝ SÁCH',
  '/categories': 'QUẢN LÝ THỂ LOẠI',
  '/publishers': 'QUẢN LÝ NHÀ XUẤT BẢN',
  '/borrow-return': 'QUẢN LÝ MƯỢN - TRẢ SÁCH',
  '/accounts': 'QUẢN LÝ TÀI KHOẢN',
};

function getPageTitle(pathname: string) {
  return pageTitles[pathname] || '';
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // Dropdown
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Lấy thông tin user từ localStorage/sessionStorage
  const [fullName, setFullName] = useState<string>('User');
  useEffect(() => {
    let name = 'User';
    try {
      const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userJson) {
        const userObj = JSON.parse(userJson);
        name = userObj.fullName || userObj.username || 'User';
      }
    } catch (e) {}
    setFullName(name);
  }, []);

  const handleLogout = async () => {
    try {
      // Gọi API logout về backend để backend trả về Set-Cookie xóa token
      await fetch('http://localhost:8081/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {}
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.title}>{getPageTitle(pathname)}</span>
      </div>
      <div className={styles.right}>
        {/* Notification bell - KHÔNG hiện số thông báo */}
        <button
          className={styles.bellBtn}
          onClick={() => router.push('/notifications')}
          title="Thông báo"
        >
          <FaBell className={styles.bellIcon} />
        </button>
        {/* User info + dropdown */}
        <div className={styles.userWrapper} ref={userRef}>
          <div className={styles.userBtn} onClick={() => setUserOpen((v) => !v)}>
            <Image
              src="/assets/avt.png"
              alt="User Avatar"
              width={36}
              height={36}
              className={styles.avatar}
            />
            <span className={styles.username}>
              {fullName}
            </span>
            <FaChevronDown className={styles.chevron} />
          </div>
          {userOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownItem}>
                <FaUser /> <span>Thông tin tài khoản</span>
              </div>
              <div className={styles.dropdownItem} onClick={handleLogout}>
                <FaSignOutAlt /> <span>Đăng xuất</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
