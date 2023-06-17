const regex = {
    id: /^[a-zA-Z\d]{4,6}$/,
    name: /^[a-zA-Z\sÀ-ỹ]+$/,
    email: /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/,
    pw: /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{6,10}$/,
    date: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[0-1])\/\d{4}$/,
    salary: /^[0-9]+$/,
    time: /^[0-9]+$/,
};

function Validator(options) {
    const formElement = _$(options.form);

    if (formElement) {
        // Handle submit form => Add / Update employee

        // Handle input / blur ==> Display notice
        options.rules.forEach((rule) => {
            const inputElement = _$(rule.selector);

            inputElement.addEventListener('blur', () => {
                const errorMessage = rule.test(inputElement.value.trim());

                if (errorMessage) {
                    inputElement.classList.add('invalid');
                    console.log(inputElement.parentElement.nextElementSibling);
                    inputElement.parentElement.nextElementSibling.innerText = errorMessage;
                } else {
                    inputElement.classList.remove('invalid');
                    inputElement.parentElement.nextElementSibling.innerText = '';
                }
            });

            inputElement.addEventListener('input', () => {
                inputElement.classList.remove('invalid');
                inputElement.parentElement.nextElementSibling.innerText = '';
            });
        });
    }
}

Validator.isAccount = function (selector) {
    return {
        selector,
        test(value) {
            let arrID = [];
            let idLength = arrID.length;
            let employeeLength = employeeList.list.length;

            // Thêm nhân viên
            if (editIndex === -1) {
                for (let i = 0; i < employeeLength; i++) {
                    arrID.push(employeeList.list[i].id);
                }
            }
            // Sửa nhân viên
            else {
                for (let i = 0; i < employeeLength; i++) {
                    employeeList.list[editIndex].id !== value ? arrID.push(employeeList.list[i].id) : null;
                }
            }

            for (let i = 0; i < idLength; i++) {
                if (value === arrID[i]) {
                    return 'Tài khoản bị trùng vui lòng kiểm tra lại';
                }
            }

            return regex.id.test(value) ? undefined : 'Tài khoản bao gồm 4 - 6 ký tự chữ và số';
        },
    };
};
