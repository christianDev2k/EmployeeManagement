/**
 * @param options { form: selector, rules: [rule 1, rule 2, rule 3,...] }
 */

function Validators(options) {
    const formElement = _$(options.form);
    if (formElement) {
        // Handle input / blur ==> Display notice
        $('#datepicker')
            .on('change', function () {
                if (regex.date.test(dateInput.value)) {
                    dateInput.parentElement.nextElementSibling.innerHTML = '';
                    dateInput.classList.remove('invalid');
                }
            })
            .trigger('change');

        options.rules.forEach((rule) => {
            const inputElement = _$(rule.selector);

            inputElement.addEventListener('blur', () => {
                validate(inputElement, rule);
            });

            inputElement.addEventListener('input', () => {
                inputElement.classList.remove('invalid');
                inputElement.parentElement.nextElementSibling.innerText = '';
            });
        });

        // handle Submit form
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            // Check valid form
            options.rules.forEach((rule) => {
                const inputElement = _$(rule.selector);
                let isValid = validate(inputElement, rule);
                !isValid ? (isFormValid = false) : null;
            });

            // isFormValid === true;
            if (isFormValid) {
                // if onSubmit is exist
                if (typeof options.onSubmit === 'function') {
                    const inputNodeList = formElement.querySelectorAll('.form-control[name]');
                    const inputArray = Array.from(inputNodeList);

                    const data = inputArray.reduce((accData, input) => {
                        return (accData[input.name] = input.value) && accData;
                    }, {});

                    options.onSubmit(data);
                }
                // else onSubmit isn't exist
                else formElement.submit();
            }
        });
    }

    // ====================== Funtions =========================

    function validate(inputElement, ruleObject) {
        const errorMessage = ruleObject.test(inputElement.value.trim());

        if (errorMessage) {
            inputElement.classList.add('invalid');
            inputElement.parentElement.nextElementSibling.innerText = errorMessage;
        } else {
            inputElement.classList.remove('invalid');
            inputElement.parentElement.nextElementSibling.innerText = '';
        }
        return !errorMessage;
    }
}

Validators.isAccount = (selector) => {
    return {
        selector,
        test(value) {
            const employeeLength = employeeList.list.length;
            let arrID = [];

            // Case: Add employee
            if (editIndex === -1) {
                for (let i = 0; i < employeeLength; i++) {
                    arrID.push(employeeList.list[i].id);
                }
            }
            // Case: Edit employee
            else {
                for (let i = 0; i < employeeLength; i++) {
                    employeeList.list[editIndex].id !== value ? arrID.push(employeeList.list[i].id) : null;
                }
            }

            // Check doublicated
            const idLength = arrID.length;
            for (let i = 0; i < idLength; i++) {
                if (value === arrID[i]) {
                    return 'Tài khoản bị trùng vui lòng kiểm tra lại';
                }
            }

            return regex.id.test(value) ? undefined : 'Tài khoản bao gồm 4 - 6 ký tự chữ và số';
        },
    };
};

Validators.isName = (selector) => {
    return {
        selector,
        test(value) {
            return regex.name.test(value) ? undefined : 'Tên nhân viên phải là chữ';
        },
    };
};

Validators.isEmail = (selector) => {
    return {
        selector,
        test(value) {
            return regex.email.test(value) ? undefined : 'Trường này phải là email';
        },
    };
};

Validators.isPassword = (selector) => {
    return {
        selector,
        test(value) {
            return regex.pw.test(value)
                ? undefined
                : 'Mật Khẩu từ 6-10 ký tự và chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt';
        },
    };
};

Validators.isDay = (selector) => {
    return {
        selector,
        test(value) {
            return regex.date.test(value) ? undefined : 'Ngày làm có định dạng mm/dd/yyyy';
        },
    };
};

Validators.isSalary = (selector) => {
    return {
        selector,
        test(value) {
            return regex.salary.test(value) && value >= 1000000 && value <= 20000000
                ? undefined
                : 'Lương cơ bản 1 000 000 - 20 000 000';
        },
    };
};

Validators.isPosition = (selector) => {
    return {
        selector,
        test(value) {
            return value !== 'non-selected' ? undefined : 'Vui lòng chọn chức vụ';
        },
    };
};

Validators.isTime = (selector) => {
    return {
        selector,
        test(value) {
            return regex.time.test(value) && value >= 80 && value <= 200
                ? undefined
                : 'Số giờ làm trong tháng 80 - 200 giờ';
        },
    };
};
