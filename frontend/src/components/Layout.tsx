'use client'
import Sidebar from './Sidebar'
import Header from './Header'
import styles from '@/styles/Layout.module.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <Header user={{ username: 'hieu' }} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
