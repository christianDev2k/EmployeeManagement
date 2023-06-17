class employee {
    constructor(id, name, email, pw, date, salary, position, time) {
        Object.assign(this, { id, name, email, pw, date, salary, position, time });
    }

    sumSalary() {
        return this.salary && this.position
            ? this.position === 'Giám đốc'
                ? this.salary * 3
                : this.position === 'Trưởng phòng'
                ? this.salary * 2
                : this.salary
            : false;
    }

    ratingEmployee() {
        return this.time
            ? this.time >= 192
                ? 'Nhân viên xuất sắc'
                : this.time >= 176
                ? 'Nhân viên giỏi'
                : this.time >= 160
                ? 'Nhân viên khá'
                : 'Nhân viên trung bình'
            : false;
    }
}