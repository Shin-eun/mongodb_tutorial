const handleAddMonth = (date, addMonth) => {
    const getDate = new Date(date);
    const addMonthDate = new Date(getDate.setMonth(getDate.getMonth() + addMonth));
    
    return addMonthDate;
}

module.exports = {handleAddMonth}