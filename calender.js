"use strict";
(function () {
    
    const prevDateButton = document.querySelector('#previous_date')
    const nextDateButton = document.querySelector('#next_date')
    const daysContainer = document.getElementById('days_container')
    const calenderHead = document.querySelector('#calender_head')
    const closeModalBtn = document.querySelector('#close_modal')
    const modal = document.querySelector('#modal');
    const eventContainer = document.querySelector('.event_container');
    const eventbContainer = document.querySelector('.event_bcontainer');
    const eventListView = document.querySelector('#event_list-view');
    const updateEventFieldset = document.querySelector('#update_event-fieldset');
    const newEventFieldset = document.querySelector('#new_event-fieldset');
    const newEventViewButton = document.querySelectorAll('.new_event-switch');
    const eventListViewButton = document.querySelectorAll('.event_view-switch');
    const noEventInfo = document.querySelector('#no_event_info');
    const updateEventForm = document.querySelector("#update_event-form")
    const createEventForm = document.querySelector("#create_event-form")
    const clearStorageButton = document.querySelector("#clear_storage")

    let selectedDayData = {}
    let bookiedata = {}
    const CreateDayCell = (currentDay, days) => {
        let dayCell = document.createElement('a');
        dayCell.classList.add('days')
        dayCell.classList.add('cell')
        //Check the current day of the month
        dayCell.dataset.current = days['day'] == currentDay ? true : false
        dayCell.dataset.event = days['event']
        dayCell.dataset.startOfWeek = days['startOfWeek']
        dayCell.dataset.dayId = days['dayId']
        dayCell.dataset.monthId = days['monthId']
        dayCell.innerText = days['day']
        return dayCell
    }
    const CreateEmptyCell = () => {
        let EmptyCell = document.createElement('div');
        EmptyCell.classList.add('cell')
        return EmptyCell
    }


    const CreateDateObj = (calender, daysContainer, calenderHead) => {
        let {
            month,
            year,
            monthInString,
            currentDay,
            weeks
        } = calender
        let dayObj
        let days
        //Add Calender Meta data to calender header DOM object
        calenderHead.innerText = `${monthInString} ${year}`
        calenderHead.dataset.month = month
        calenderHead.dataset.year = year

        for (let week = 0; week < weeks.length; week++) {
            for (let day = 0; day < weeks[week].length; day++) {
                days = weeks[week][day];
                //If the value of the month template array is not null (empty)
                if (days !== null) {
                    daysContainer.appendChild(CreateDayCell(currentDay, days))
                } else {
                    daysContainer.appendChild(CreateEmptyCell())
                }
            }

        }
    }

    const MonthToString = () => {
        const months = []
        months[0] = 'January'
        months[1] = 'February'
        months[2] = 'March'
        months[3] = 'April'
        months[4] = 'May'
        months[5] = 'June'
        months[6] = 'July'
        months[7] = 'August'
        months[8] = 'September'
        months[9] = 'October'
        months[10] = 'November'
        months[11] = 'December'
        return months
    }

    const CurrentDate = () => {
        let date = new Date()
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        }
    }

    const GenerateWeeksFromStorage = (year, month) => {
        return JSON.parse(localStorage.getItem(`${month}-${year}`))
    }

    const GenerateNewWeeks = (year, month) => {
        const monthTemplate = [
            [null, null, null, null, null, null, null], //week 1
            [], //week 2
            [], //week 3
            [], //week 4
            [], //week 5
            [] //week 6
        ]
        // 0 is the last Day of the previous day
        const numOfDaysInMonth = new Date(year, month + 1, 0).getDate()
        let calenderDays = [];
        calenderDays = monthTemplate;
        let weekNumber = 0
        for (let day = 1; day <= numOfDaysInMonth; day++) {
            let date = new Date(year, month, day)
            let dayOfWeek = date.getDay()
            let startOfWeek = dayOfWeek == 0 ? true : false
            //Check if a new week has started so as to increase the week number
            if (startOfWeek == true && day !== 1) {
                weekNumber++
            }
            try {
                calenderDays[weekNumber][dayOfWeek] = {
                    day: day,
                    week: dayOfWeek,
                    event: false,
                    startOfWeek: startOfWeek,
                    month: month,
                    year: year,
                    eventData: [],
                    dayId: `${weekNumber}-${dayOfWeek}`,
                    monthId: `${month}-${year}`
                }
            } catch (error) {
                console.log(error)
                break;
            }
        }
        //Save newly generated weeks in localStorage
        localStorage.setItem(`${month}-${year}`, JSON.stringify(calenderDays))
        return calenderDays;
    }
    const SetCalenderDays = (year, month) => {
        if (localStorage.getItem(`${month}-${year}`)) {
            return GenerateWeeksFromStorage(year, month)
        }
        return GenerateNewWeeks(year, month);
    }

    const CreateCalender = (getSetDate) => {
        let {
            year,
            month,
            day
        } = getSetDate()
        let calender = {}
        calender['monthInString'] = MonthToString()[month]
        calender['month'] = month
        calender['year'] = year
        calender['currentDay'] = day
        calender['weeks'] = SetCalenderDays(year, month);
        return CreateDateObj(calender, daysContainer, calenderHead);
    }

    const getCurrentDay = (selectedMonth, selectedYear) => {
        let currentDate = new Date()
        let [currentYear, currentMonth, currentDay] = [currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()]
        return currentYear == selectedYear && currentMonth == selectedMonth ? currentDay : 0
    }
    const CreateNextCalender = () => {
        let selectedMonth = parseInt(calenderHead.dataset.month) + 1
        let selectedYear = parseInt(calenderHead.dataset.year)
        if (selectedMonth > 11) {
            selectedMonth = 0
            selectedYear++
        }
        return {
            month: selectedMonth,
            year: selectedYear,
            day: getCurrentDay(selectedMonth, selectedYear)
        }
    }
    const CreatePreviousCalender = () => {
        let selectedMonth = parseInt(calenderHead.dataset.month) - 1
        let selectedYear = parseInt(calenderHead.dataset.year)
        if (selectedMonth < 0) {
            selectedMonth = 11
            selectedYear--
        }
        return {
            month: selectedMonth,
            year: selectedYear,
            day: getCurrentDay(selectedMonth, selectedYear)
        }
    }
    const EmptyCalender = () => {
        while (daysContainer.lastChild) {
            daysContainer.removeChild(daysContainer.lastChild)
        }
    }

    const CreateEventTemplate = (eventData = []) => {
        let eventCard = ""
        eventData.forEach((event, index) => {
            eventCard += `<div class="event_card">
            <h4 class="header">${event['name']}</h4>
                <p>${event['description']}</p>
                <p>${event['emailId']}</p>
                <p>At ${event['time']}</p>

                <div class="button-container">
                <button class="button is-outlined update_event-switch" data-event-id="${index}">Book Event</button>
                <button class="button delete_event" data-event-id="${index}">Delete Event</button>
                </div>
        </div>`
        })
        eventContainer.innerHTML = eventCard;
    }
    const CreateEventTemplateb = (eventData = []) => {
        let eventCarda = ""
        eventData.forEach((event, index) => {
            eventCarda += `<div class="event_card">
            <h4 class="header">booked</h4> 
                <p>${event['bookiename']}</p>
                <p>${event['bookieemailId']}</p>
                                
        </div>`
        })
        eventbContainer.innerHTML = eventCarda;
    }
    
    const CollectSelectedDayData = (dayId = "", monthId = "") => {
        let calender = JSON.parse(localStorage.getItem(monthId))
        dayId = dayId.split('-')
        let [weekNumber, dayOfWeek] = [parseInt(dayId[0]), parseInt(dayId[1])]
        return selectedDayData = calender[weekNumber][dayOfWeek]
    }
    const CollectSelectedDayDatab = (dayId = "", monthId = "") => {
        let calender = JSON.parse(localStorage.getItem(monthId))
        dayId = dayId.split('-')
        let [weekNumber, dayOfWeek] = [parseInt(dayId[0]), parseInt(dayId[1])]
        return bookiedata = calender[weekNumber][dayOfWeek]
    }
    const RefreshEventView = () => {
        if (selectedDayData['eventData'].length > 0) {
            eventContainer.dataset.show = true
            CreateEventTemplate(selectedDayData.eventData)
            return noEventInfo.dataset.show = false
        }
        eventContainer.innerHTML = "";
        return noEventInfo.dataset.show = true
    }
    const CheckForValidEvent = (e) => {
        if (selectedDayData['eventData'].length > 0) {
            console.log(e.target)
            let [name, time] = [e.target.elements.event_name.value, e.target.elements.event_time.value]
            for(let event of selectedDayData['eventData']){
                 let validity = event.time == time || event.name == name ? false : true
                 if(validity == false){
                     return validity
                 }
            }
        }
        return true;
    }
    const PushToEventArray = (e) => {
        selectedDayData['event'] = true
        return selectedDayData['eventData'].push({
            name: e.target.elements.event_name.value,
            description: e.target.elements.event_desc.value,
            time: e.target.elements.event_time.value,
            emailId: e.target.elements.event_emailId.value
        })
    }

    const UpdateSelectedDayDataInLocalStorage = () => {
        let calender = JSON.parse(localStorage.getItem(selectedDayData['monthId']))
        let dayId = selectedDayData['dayId'].split('-')
        let [weekNumber, dayOfWeek] = [parseInt(dayId[0]), parseInt(dayId[1])]
        calender[weekNumber][dayOfWeek] = selectedDayData
        localStorage.setItem(selectedDayData['monthId'], JSON.stringify(calender));
        return [calender, dayId, weekNumber, dayOfWeek] = [null, null, null, null]
    }
    const RefreshCurrentMonthView = () => {
        let [selectedMonth, selectedYear] = [selectedDayData['month'], selectedDayData['year']]
        EmptyCalender()
        CreateCalender(() => {
            return {
                month: selectedMonth,
                year: selectedYear,
                day: getCurrentDay(selectedMonth, selectedYear)
            }
        })
    }








    // const CollectSelectedDayDatab = (dayId = "", monthId = "") => {
    //     let calender = JSON.parse(localStorage.getItem(monthId))
    //     dayId = dayId.split('-')
    //     let [weekNumber, dayOfWeek] = [parseInt(dayId[0]), parseInt(dayId[1])]
    //     return bookiedata = calender[weekNumber][dayOfWeek]
    // }
    const RefreshEventViewb = () => {
        if (bookiedata['eventData'].length > 0) {
            eventbContainer.dataset.show = true
            CreateEventTemplateb(bookiedata.eventData)
            return noEventInfo.dataset.show = false
        }
        eventbContainer.innerHTML = "";
        return noEventInfo.dataset.show = true
    }
    const CheckForValidEventb = (e) => {
        if (bookiedata['eventData'].length > 0) {
            console.log(e.target)
            let [bookiename,bookieemailId ] = [e.target.elements.event_bookiename.value, e.target.elements.event_bookieemailId.value]
            for(let event of bookiedata['eventData']){
                 let validity = event.bookieemailId == bookieemailId || event.bookiename == bookiename ? false : true
                 if(validity == false){
                     return validity
                 }
            }
        }
        return true;
    }
    const PushToEventArrayb = (e) => {
        bookiedata['event'] = true
        return bookiedata['eventData'].push({
            bookiename: e.target.elements.event_bookiename.value,
            bookieemailId: e.target.elements.event_bookieemailId.value
        })
    }

    const UpdateSelectedDayDataInLocalStorageb = () => {
        let calender = JSON.parse(localStorage.getItem(bookiedata['monthId']))
        let dayId = bookiedata['dayId'].split('-')
        let [weekNumber, dayOfWeek] = [parseInt(dayId[0]), parseInt(dayId[1])]
        calender[weekNumber][dayOfWeek] = bookiedata
        localStorage.setItem(bookiedata['monthId'], JSON.stringify(calender));
        return [calender, dayId, weekNumber, dayOfWeek] = [null, null, null, null]
    }
    const RefreshCurrentMonthViewb = () => {
        let [selectedMonth, selectedYear] = [bookiedata['month'], bookiedata['year']]
        EmptyCalender()
        CreateCalender(() => {
            return {
                month: selectedMonth,
                year: selectedYear,
                day: getCurrentDay(selectedMonth, selectedYear)
            }
        })
    }
    const AlertWarning = () => {
        return alert('This Event name or time already exist. Please Try Again');
    }
    const AlertSuccess = () => {
        return alert('Event was successfully created');
    }
    const AlertSuccessl = () => {
        return alert('Event was successfully booked');
    }
    const SwitchToEventListView = () => {
        eventListView.dataset.show = true
        newEventFieldset.dataset.show = false
        updateEventFieldset.dataset.show = false
    }
    const SwitchToNewEventView = () => {
        eventListView.dataset.show = false
        newEventFieldset.dataset.show = true
        updateEventFieldset.dataset.show = false
    }
    const SwitchToUpdateEventView = () => {
        eventListView.dataset.show = false
        newEventFieldset.dataset.show = false
        updateEventFieldset.dataset.show = true
    }
    const RemoveEventEventArray = (e) => {
        selectedDayData['eventData'].splice(parseInt(e.dataset.eventId), 1)
        if (selectedDayData['eventData'].length == 0) {
            eventContainer.dataset.show = false
            return selectedDayData['event'] = false;
        }
        return
    }
    const RemoveEventEventArrayb = (e) => {
        bookiedata['eventData'].splice(parseInt(e.dataset.eventId), 1)
        if (bookiedata['eventData'].length == 0) {
            eventbContainer.dataset.show = false
            return bookiedata['event'] = false;
        }
        return
    }
    // const UpdateEventArray = (e) => {

    //     selectedDayData['event'] = true
    //     return selectedDayData['eventData'].push({
    //         bookiename: e.target.elements.event_bookiename.value,
    //        // description: e.target.elements.event_desc.value,
    //        // time: e.target.elements.event_time.value,
    //         bookieemailId: e.target.elements.event_bookieemailId.value
    //     })

        // selectedDayData['eventData'][parseInt(e.target.dataset.eventId)]['name'] = e.target.elements.event_name.value
        // selectedDayData['eventData'][parseInt(e.target.dataset.eventId)]['description'] = e.target.elements.event_desc.value
        // selectedDayData['eventData'][parseInt(e.target.dataset.eventId)]['emailId'] = e.target.elements.event_emailId.value
        // selectedDayData['eventData'][parseInt(e.target.dataset.eventId)]['time'] = e.target.elements.event_time.value
    //}
    const CreateEvent = (e) => {
        if (CheckForValidEvent(e)) {
            PushToEventArray(e)
            UpdateSelectedDayDataInLocalStorage()
            RefreshEventView()
            RefreshCurrentMonthView()
            AlertSuccess()
        } else {
            AlertWarning()
        }
    }
    const UpdateEvent = (e) => {
        if (CheckForValidEventb(e)) {
            PushToEventArrayb(e)
            UpdateSelectedDayDataInLocalStorageb()
            RefreshEventViewb()
            RefreshCurrentMonthViewb()
            AlertSuccessl()
        } else {
            AlertWarning()
        }
    }
    const DeleteEvent = (e) => {
        RemoveEventEventArray(e)
        UpdateSelectedDayDataInLocalStorage()
        RefreshEventView()
        RefreshCurrentMonthView()
    }
    

    const OpenModal = (event) => {
        if (event.target.matches('.days')) {
            modal.dataset.show = true
            modal.dataset.monthId = event.target.dataset.monthId
            CollectSelectedDayData(event.target.dataset.dayId, event.target.dataset.monthId)
            CollectSelectedDayDatab(event.target.dataset.dayId, event.target.dataset.monthId)
            RefreshEventView()
            SwitchToEventListView()
        }
        return event.preventDefault();
    }
    // const TransferEventDataToFieldset = (event) => {
    //     let selectedEvent = selectedDayData['eventData'][event.dataset.eventId];
    //     updateEventForm.elements.event_bookiename.value = selectedEvent.name
    //     updateEventForm.elements.event_desc.value = selectedEvent.description
    //     updateEventForm.elements.event_emailId.value = selectedEvent.emailId
    //     updateEventForm.elements.event_time.value = selectedEvent.time
    //     updateEventForm.dataset.eventId = event.dataset.eventId
    // }
    const ClickEventButtons = (event) => {
        if (event.target.matches('.update_event-switch')) {
            SwitchToUpdateEventView()
            TransferEventDataToFieldset(event.target)
        }
        if (event.target.matches('.delete_event')) {
            DeleteEvent(event.target)
        }

       
        return event.preventDefault();
    }
    const CloseModal = (e) => {
        modal.dataset.show = false
        return e.preventDefault();
    }
    const ClearStorage = (e)=>{
        e.preventDefault()
        alert('Local Storage Cleared')
        return localStorage.clear()
    }
    CreateCalender(CurrentDate);
    nextDateButton.addEventListener('click', function () {
        EmptyCalender()
        CreateCalender(CreateNextCalender)
    })
    prevDateButton.addEventListener('click', function () {
        EmptyCalender()
        CreateCalender(CreatePreviousCalender)
    })
    daysContainer.addEventListener('click', OpenModal)
    closeModalBtn.addEventListener('click', CloseModal)
    createEventForm.addEventListener('submit', CreateEvent)
    newEventViewButton.forEach((button) => {
        button.addEventListener('click', SwitchToNewEventView)
    })
    eventListViewButton.forEach((button) => {
        button.addEventListener('click', SwitchToEventListView)
    })
    eventContainer.addEventListener('click', ClickEventButtons)
    //eventbContainer.addEventListener('click', ClickEventButtons)
    updateEventForm.addEventListener('submit', UpdateEvent)
    clearStorageButton.addEventListener('click', ClearStorage)
})()