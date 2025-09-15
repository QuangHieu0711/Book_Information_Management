'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '../app/api/auth/login/auth'
import styles from './Login.module.css'

import { FaGoogle, FaFacebookF, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Nếu đã đăng nhập, tự động chuyển hướng sang dashboard
  useEffect(() => {
    if (typeof window !== "undefined" && document.cookie.includes("authToken=")) {
      window.location.href = '/dashboard'
    }
  }, []) // <-- dùng dependency rỗng

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(username, password)
      if (res?.status) {
        window.location.href = "/dashboard"
      } else {
        alert(res.userMessage || 'Đăng nhập thất bại. Vui lòng thử lại!')
      }
    } catch (err: any) {
      console.error('❌ Error in login:', err)
      alert(err?.detail || 'Sai tài khoản hoặc mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <img src='/assets/login.png' alt='Login illustration' />
      </div>
      <div className={styles.right}>
        <div className={styles.formBox}>
          <h2 className={styles.title}>ĐĂNG NHẬP</h2>
          <p className={styles.subText}>
            Chưa có tài khoản? <a href='#!'>Đăng ký</a>
          </p>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor='username'>Tài khoản</label>
              <input
                type='text'
                id='username'
                placeholder='Nhập tài khoản...'
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup} style={{ position: 'relative' }}>
              <label htmlFor='password'>Mật khẩu</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                placeholder='Nhập mật khẩu...'
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '38px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className={styles.options}>
              <label className={styles.checkbox}>
                <input type='checkbox' checked={remember} onChange={e => setRemember(e.target.checked)} />
                Ghi nhớ mật khẩu
              </label>
              <a href='#!' className={styles.forgot}>
                Quên mật khẩu?
              </a>
            </div>
            <button className={styles.btnPrimary} type='submit' disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
          <p className={styles.orText}>Hoặc đăng nhập bằng</p>
          <div className={styles.socials}>
            <a href='#!' className={`${styles.socialBtn} ${styles.google}`}>
              <FaGoogle />
            </a>
            <a href='#!' className={`${styles.socialBtn} ${styles.facebook}`}>
              <FaFacebookF />
            </a>
            <a href='#!' className={`${styles.socialBtn} ${styles.github}`}>
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
