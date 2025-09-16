'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from '../styles/Sidebar.module.css'
import logo from '../../public/assets/logo.png'

const menuItems = [
  { label: 'TRANG CHỦ', href: '/dashboard' },
  { label: 'TÁC GIẢ', href: '/authors' },
  { label: 'THỂ LOẠI', href: '/categories' },
  { label: 'NHÀ XUẤT BẢN', href: '/publishers' },
  { label: 'SÁCH', href: '/books' },
  { label: 'MƯỢN - TRẢ SÁCH', href: '/borrow-return' },
  { label: 'TÀI KHOẢN', href: '/accounts' }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className={styles.sidebar}>
      <div className={styles['sidebar-logo']}>
        <Image src={logo} alt='Logo' className={styles['logo-image']} priority />
      </div>
      <ul className={styles['sidebar-menu']}>
        {menuItems.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${styles['menu-link-standalone']} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
