import DashboardLayout from '@/components/Layout'
import styles from '@/styles/Dashboard.module.css'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className={styles["dashboard-container"]}>
        <h1 className={styles["dashboard-title"]}>Dashboard</h1>
        <p className={styles["dashboard-welcome"]}>Chào mừng bạn đến với trang quản trị!</p>
        <div className={styles["dashboard-widgets"]}>
          <div className={styles["dashboard-widget"]}>
            <h2 className={styles["dashboard-widget-title"]}>Tổng số sách</h2>
            <div className={styles["dashboard-widget-value"]}>123</div>
          </div>
          <div className={styles["dashboard-widget"]}>
            <h2 className={styles["dashboard-widget-title"]}>Tổng số tác giả</h2>
            <div className={styles["dashboard-widget-value"]}>45</div>
          </div>
          <div className={styles["dashboard-widget"]}>
            <h2 className={styles["dashboard-widget-title"]}>Tổng thể loại</h2>
            <div className={styles["dashboard-widget-value"]}>12</div>
          </div>
          <div className={styles["dashboard-widget"]}>
            <h2 className={styles["dashboard-widget-title"]}>Tổng NXB</h2>
            <div className={styles["dashboard-widget-value"]}>6</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
