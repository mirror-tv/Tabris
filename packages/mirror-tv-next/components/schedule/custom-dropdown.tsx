'use client'
import React, { useState } from 'react'
import styles from './_styles/custom-dropdown.module.scss'

type WeekDate = {
  date: string
  dayOfWeek: string
  year: number
}

type CustomDropDownProps = {
  weekDates: WeekDate[]
  selectedDate: WeekDate
  // eslint-disable-next-line no-unused-vars
  onDateChange: (date: WeekDate) => void
}

export default function CustomDropDown({
  weekDates,
  selectedDate,
  onDateChange,
}: CustomDropDownProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const handleDateChange = (date: WeekDate) => {
    setIsOpen(false)
    onDateChange(date)
  }

  return (
    <div className={styles.customDropdownContainer}>
      <div
        className={`${styles.dropdownButton} ${isOpen ? styles.isOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {`${selectedDate.year}/${
          selectedDate.date
        } (${selectedDate.dayOfWeek.slice(2)})`}
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {weekDates.map((date) => (
            <div
              key={date.date}
              className={styles.option}
              onClick={() => handleDateChange(date)}
            >
              {date.year}/{date.date}&ensp; ({date.dayOfWeek.slice(2)})
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
