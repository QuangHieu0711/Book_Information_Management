'use client';

import React, { useState, useEffect } from 'react';
import modalStyles from '@/styles/Form.module.css';

export default function Address() {

const CITY_OPTIONS = [
  { id: 'Hà Nội', name: 'Hà Nội' },
  { id: 'TP Hồ Chí Minh', name: 'TP Hồ Chí Minh' },
  { id: 'Đà Nẵng', name: 'Đà Nẵng' },
  { id: 'Hải Phòng', name: 'Hải Phòng' },
  { id: 'Cần Thơ', name: 'Cần Thơ' },
]

  return (
            <div className={modalStyles['form-group']} style={{ marginBottom: 16 }}>
            <label className={modalStyles['form-label']}>
              Tỉnh/Thành phố <span style={{ color: '#e53935' }}>*</span>
            </label>
            <select
              className={`${modalStyles['input']} ${modalStyles['select']}`}
              name='city'
            >
              <option value=''>-- Chọn tỉnh/thành phố --</option>
              {CITY_OPTIONS.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>


          
  )
}

