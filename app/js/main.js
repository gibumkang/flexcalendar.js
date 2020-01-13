;(() => {
    const calendar = () => {

        const today = new Date();
        
        //using momentjs to take today's date, add x days for a due date, format to MM-DD-YYYY and convert into a new Date
        const dueDate = new Date(moment(today).add(10, 'days').format('l'));
        //using momentjs to take today's date, add x days for an invalid future date, format to MM-DD-YYYY and convert into a new Date
        const invalidDate = new Date(moment(today).add(45, 'days').format('l'));

        let selectedDate = [];
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',]
        
        const left = document.querySelector('.left');
        const right = document.querySelector('.right');
        const message = document.querySelector('.message');
        const cbody = document.querySelector('.calendar-body');
        const continueBtn = document.querySelector('.continue');
        const monthYear = document.querySelector('.month-year');
        const domDate = document.querySelector('.selected-date');
        const selected = document.getElementsByClassName('selected');
        const lateDate = document.getElementsByClassName('late-date');
        const eligibleDate = document.getElementsByClassName('eligible-date');

        //sass variables - make sure they match with the variables depicted in style.scss
        const $red = '#D0021B';
        const $lightblue = '#2B608D';
        const $mediumblue = '#076191';

        //About this calendar app:
        //This application is built with JavaScript's native Date API, moment.js and some es6 methods.
        //The calendar is constructed by first pinpointing the index of the first day of the month.
        //Once this variable is assigned, the number of total days of the selected month is calculated.
        //Then, the rows and dates are built using for-loops. The first day of the month is plotted on the calendar
        //by plotting the grey (previous month's days) first. By doing so, when the index surpasses the index
        //of the actual first day, the for-loop stops and the actual days begin to plot with the date variable passed in it.
        //Throughout the next series of conditionals, the calendar is then customized with today, due, and late.
        //If more markers are required, a new conditional can be created to assign one.
        //The navigation buttons control the current month that is displayed (more info below).

        const showCalendar = (month, year) => {

            //clears all existing cells
            cbody.innerHTML = '';
            
            //firstDay receives the year and month and retrieves the first day of the month (ex: Monday = 0)
            let firstDay = (new Date(year, month)).getDay()
    
            //calculates the total days in the selected month
            let daysInMonth = 32 - new Date(year, month, 32).getDate()
    
            //display the current month and year in header
            monthYear.innerHTML = `${months[month]} <span>${year}</span>`;
            
            let date = 1;
            //create rows for the dates
            for(let i = 0; i < 6; i++){
                let row = document.createElement('div') //containing flex-row
                row.className = 'flex-row';
    
                //days in the week
                for(let j = 0; j < 7; j++){
                    //if the week iterator (i) is at zero and day iterator (j) is not the first day, then
                    //create empty nodes before the actual dates are listed
                    if(i === 0 && j < firstDay){
                        emptyCellStyler(row);
    
                    //if the date is greater than the total days in the month, stop the loop
                    }else if(date > daysInMonth){
                        emptyCellStyler(row);
                        //break;
                    }else {
                        let cell = document.createElement('div') //flex children
                        cell.classList.add('date-node', 'eligible-date');
                        let cellText = document.createTextNode(date)
    
                        //if dates are before the present year, then disable
                        if(year < today.getFullYear()){
                            pastDateStyler(cell);
                        }
                        //if dates are berfore the present year and month, then disable
                        if(year <= today.getFullYear() && month <= today.getMonth() && date < today.getDate()){
                            pastDateStyler(cell);
                        }
                        //if current month and year are less than the present + 1 month then disable
                        if(year >= invalidDate.getFullYear() && month >= (invalidDate.getMonth()+1)){
                            pastDateStyler(cell);
                        }
                        //disabling the future due months and years
                        if(year >= invalidDate.getFullYear()+1 && month >= (invalidDate.getMonth()-1)){
                            pastDateStyler(cell);
                        }
                        //if dates are 45 days more than the present date, then disable for that month
                        if(date >= invalidDate.getDate() && year >= invalidDate.getFullYear() && month >= invalidDate.getMonth()){
                            pastDateStyler(cell);
                        }
                        //if a date matches todays date, then mark on calendar
                        if(date === today.getDate() && year === today.getFullYear() && month === today.getMonth()){
                            cell.classList.add('selected');
                            let cellDate = document.createElement('div') //today marker
                            let cellDateText = document.createTextNode('Today')
                            cell.style.outline = '1px solid' + $lightblue;
                            cellDate.classList.add('todays-date');
                            markerStyler(cell, cellDate, cellDateText);
                        }
                        //if a date matches the due date, then mark on the calendar
                        if(date === dueDate.getDate() && year === dueDate.getFullYear() && month === dueDate.getMonth()){
                            let cellDate = document.createElement('div') //due marker
                            let cellDateText = document.createTextNode('Due')
                            cell.style.outline = '1px solid' + $red;
                            cellDate.classList.add('due-date');
                            markerStyler(cell, cellDate, cellDateText);
                        }
                        //mark dates that are before the due date for the current month only
                        if(year === dueDate.getFullYear() && month === dueDate.getMonth()){
                            if(date > dueDate.getDate()){
                                let cellDate = document.createElement('div') //due marker
                                let cellDateText = document.createTextNode('Late');
                                cellDate.classList.add('late-payment');
                                cell.classList.add('late-date');
                                cellDate.appendChild(cellDateText);
                                cell.appendChild(cellDate);
                            }
                        }
                        //mark dates that are before the current month and year
                        if(year >= dueDate.getFullYear() && month >= (dueDate.getMonth()+1)){
                            let cellDate = document.createElement('div') //due marker
                            let cellDateText = document.createTextNode('Late');
                            cellDate.classList.add('late-payment');
                            cell.classList.add('late-date');
                            cellDate.appendChild(cellDateText);
                            cell.appendChild(cellDate);
                        }
                        cell.appendChild(cellText)
                        row.appendChild(cell)
                        date++
                    }
                }
                cbody.appendChild(row);
            }
            dateStyler();
            lateDateSelected();
            dateSelector(month, year);
            continueButton(month, year);
        };

        const pastDateStyler = cell => {
            cell.style.color = '#999';
            cell.classList.remove('eligible-date');
            cell.classList.add('invalid-date');
        }

        const emptyCellStyler = row => {
            let cell = document.createElement('div') //containing flex-children
            let cellText = document.createTextNode('');            
            cell.classList.add('empty-node');
            cell.appendChild(cellText);
            row.appendChild(cell);
        };

        const markerStyler = (cell, cellDate, cellDateText) => {
            cell.style.outlineOffset = '-1px';
            cellDate.appendChild(cellDateText);
            cell.appendChild(cellDate);

            cell.addEventListener('mouseover', () => {
                cell.classList.add('white');
                cellDate.classList.add('white');
            });
            cell.addEventListener('mouseout', () => {
                cell.classList.remove('white');
                cellDate.classList.remove('white');
            });

        };

        const dateStyler = () => {
            for(let i = 0; i < lateDate.length; i++){
                lateDate[i].addEventListener('mouseover', () => {
                    lateDate[i].firstElementChild.style.opacity = 1;
                });
                lateDate[i].addEventListener('mouseout', () => {
                    lateDate[i].firstElementChild.style.opacity = 0;
                });
            };
            //const todaysDate = document.querySelector('.todays-date');
            //todaysDate.parentElement.style.color = $mediumblue;
            // const dueDate = document.querySelector('.due-date');
            // dueDate.parentElement.style.color = $red;
        };
    
        const lateDateSelected = () => {
            for(let i = 0; i < eligibleDate.length; i++){
                eligibleDate[i].addEventListener('click', () => {
                    if(eligibleDate[i].classList.contains('late-date') == true ){
                        message.innerHTML = 'Schedule your payment before your due date to avoid a late fee.'
                        continueBtn.style.background = $red;
                    }else {
                        message.innerHTML = '&nbsp;';
                        continueBtn.style.background = $mediumblue;
                    }
                });
            };
        };
    
        const continueButton = (month, year) => {
            continueBtn.addEventListener('click', () => {
                if(selected[0]){
                    selectedDate = [];
                    let string = selected[0].textContent;
                    let currentMonth = month+1;
                    string.includes('Late') ? string = string.replace('Late', '') : null;
                    string.includes('Due') ? string = string.replace('Due', '') : null;
                    string.includes('Today') ? string = string.replace('Today', '') : null;
                    currentMonth < 10 ? currentMonth = '0' + currentMonth.toString() : currentMonth = currentMonth.toString();
                    let selection = `${currentMonth}/${string}/${year}`;
                    selectedDate.push(selection);
                    //let selectedDate = new Date(`${currentMonth}/${string}/${year}`);
                    domDate.innerText = selectedDate;
                }
            });
        }

        const navigationControls = () => {
            left.addEventListener('click', () => {
                //if currentMonth is 0 then select the previous year, else display the current year (Years are indexed from 1)
                currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
        
                //if currentMonth is 0 (Jan) then select 11 (Dec), else display current month -1 (Months are indexed from 0)
                currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
                showCalendar(currentMonth, currentYear);
            });
        
            right.addEventListener('click', () => {
                //if currentYear is equal to 11, then show currentYear + 1, else show the current year
                currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
        
                //currentMonth + 1 divided by 12 and return the remainder
                currentMonth = (currentMonth + 1) % 12;
                showCalendar(currentMonth, currentYear);
            });   
        }
    
        const dateSelector = () => {
            for(let i = 0; i < eligibleDate.length; i++){
                eligibleDate[i].addEventListener('click', () => {
                    [].forEach.call(eligibleDate, node => {
                        node.classList.remove('selected');
                    });
                    eligibleDate[i].classList.add('selected');
                });
            };
        };

        showCalendar(currentMonth, currentYear);
        navigationControls(currentMonth, currentYear);
    }
    //Initialize the application by starting the method with the currentMonth and currentYear parameters.
    document.addEventListener('DOMContentLoaded', calendar());
})();