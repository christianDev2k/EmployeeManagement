class EmployeesList {
    constructor() {
        this.list = [];
    }


    // Tìm index
    findIndexMethod(id) {
        let indexItem = -1;
        this.list.forEach((employee, index) => {
            if (employee.id === id) {
                indexItem = index;
            }
        });
        return indexItem;
    }

    // Thêm nhân viên
    addEmployeeMethod(employee) {
        this.list.push(employee);
    }

    // Chỉnh sửa nhân viên
    editEmployee(editedEmployee, index) {
        this.list[index] = editedEmployee;
    }

    // Xóa nhân viên
    deleteEmployee(id) {
        const index = this.findIndexMethod(id);
        this.list.splice(index, 1);
    }

    // Tìm nhân viên
    searchEmployee(value) {
        // Chuyển value về dạng: xóa khoảng trắng, chữ thường, không dấu.
        const keyInput = value.trim().toLowerCase();
        const engInputValue = keyInput.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return this.list.filter((employee) => {
            // Chuyển kết quả rating về dạng: xóa khoảng trắng, chữ thường, không dấu.
            if (employee.ratingEmployee()) {
                const ratingLowerCase = employee.ratingEmployee().toLowerCase();
                const engRatingValue = ratingLowerCase.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                const [a, b, ...ratingKeys] = engRatingValue.split(' ');

                if (engInputValue === engRatingValue) {
                    return employee;
                } else if (ratingKeys.join(' ') === engInputValue) {
                    return employee;
                } else if (ratingKeys.join('') === engInputValue) {
                    return employee;
                } else {
                    for (let i = 0; i < ratingKeys.length; i++) {
                        if (ratingKeys[i] === engInputValue) {
                            return employee;
                        }
                    }
                }
            }
        });
    }
}