"use client"

import React from 'react'
import BigCalendar from '../../../components/BigCalendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const SingleManager = () => {
  return (
    <div className='flex-1 p-4 flex flex-col xl:flex-row gap-4'>
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
            {/* TOP */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* USER INFO CARD */}
                <div className="bg-slate-300 py-6 px-4 rounded-md flex-1 flex gap-4">
                    <div className="w-1/3">
                        <img src="/illustration1.gif" alt="" width={144} height={144} className='w-36 h-36 rounded-full object-cover'/>
                    </div>
                    <div className="w-2/3 flex flex-col justify-between gap-4">
                        <h1 className='text-xl font-semibold'>Leonard Synder</h1>
                        <p className='text-sm text-gray-500'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae aspernatur
                        </p>
                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <img src="/blood.png" alt="" width={14} height={14}/>
                                <span>A+</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <img src="/date.png" alt="" width={14} height={14}/>
                                <span>January 2024</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <img src="/mail.png" alt="" width={14} height={14}/>
                                <span>user@gmail.com</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <img src="/phone.png" alt="" width={14} height={14}/>
                                <span>034 21 254 21</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* SMALL CARD */}
                <div className="flex-1 flex gap-4 justify-between flex-wrap">
                    {/* CARD */}
                    <div className="w-full bg-white p-4 rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] items-center">
                        <img src="/singleAttendance.png" alt="" width={24} height={24} className='w-6 h-6'/>
                        <div className="">
                            <h1 className='text-xl font-semibold'>7</h1>
                            <span className='text-sm text-gray-500'> En attente</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="w-full bg-white p-4 rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] items-center">
                        <img src="/singleBranch.png" alt="" width={24} height={24} className='w-6 h-6'/>
                        <div className="">
                            <h1 className='text-xl font-semibold'>9</h1>
                            <span className='text-sm text-gray-500'>subordonnee</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="w-full bg-white p-4 rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] items-center">
                        <img src="/singleLesson.png" alt="" width={24} height={24} className='w-6 h-6'/>
                        <div className="">
                            <h1 className='text-xl font-semibold'>85</h1>
                            <span className='text-sm text-gray-500'>Lessons</span>
                        </div>
                    </div>
                    {/* CARD */}
                    <div className="w-full bg-white p-4 rounded-md flex gap-4 md:w-[48%] xl:w-[45%] 2xl:w-[48%] items-center">
                        <img src="/singleClass.png" alt="" width={24} height={24} className='w-6 h-6'/>
                        <div className="">
                            <h1 className='text-xl font-semibold'>36%</h1>
                            <span className='text-sm text-gray-500'>Attendance</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM */}
            <div className="mt-4 bg-white rounded-md p-4 h-[450px]">
                <h1>Calendrier des subordonnee</h1>
                <BigCalendar/>
            </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3"></div>
    </div>
  )
}

export default SingleManager