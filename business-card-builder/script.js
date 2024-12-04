function change_view() {

    let organization_text = document.querySelector("#organization");
    let name_text = document.querySelector("#name");
    let position_text = document.querySelector("#position");
    let phone_text = document.querySelector("#phone");
    let phone2_text = document.querySelector("#phone2");
    let email_text = document.querySelector("#email");
    let address_text = document.querySelector("#address");

    let name_align = document.querySelector('input[name="name-align"]:checked');
    let position_align = document.querySelector('input[name="position-align"]:checked');

    let name_font = document.querySelector('input[name="name-font"]:checked');
    let position_font = document.querySelector('input[name="position-font"]:checked');

    let name_color = document.querySelector('input[name="name-color"]:checked');
    let position_color = document.querySelector('input[name="position-color"]:checked');

    let email_opacity = document.querySelector("#email-opacity");
    let address_opacity = document.querySelector("#address-opacity");

    let organization_view = document.querySelector("#organization-view");
    let name_view = document.querySelector("#name-view");
    let position_view = document.querySelector("#position-view");
    let number_view = document.querySelector("#number-view");
    let number2_view = document.querySelector("#number2-view");
    let email_view = document.querySelector("#email-view");
    let address_view = document.querySelector("#address-view");

    organization_view.textContent = organization_text.value;
    name_view.textContent = name_text.value;
    position_view.textContent = position_text.value;
    email_view.textContent = email_text.value;
    number_view.textContent = phone_text.value;
    number2_view.textContent = phone2_text.value;
    address_view.innerHTML = address_text.value;

    name_view.style.textAlign = name_align.value;
    position_view.style.textAlign = position_align.value;

    name_view.style.fontSize = name_font.value;
    position_view.style.fontSize = position_font.value;

    name_view.style.color = name_color.value;
    position_view.style.color = position_color.value;

    if (!email_opacity.checked) {
        email_view.style.display = "None";
    } else {
        email_view.style.display = "block";
    }

    if (!address_opacity.checked) {
        address_view.style.display = "None";
    } else {
        address_view.style.display = "block";
    }
}

function add_number() {
    let [new_phone, del_button, view_phone] = document.querySelectorAll("#phone2, #phone-button2, #number2-view");
    new_phone.style.display = "inline-block";
    del_button.style.display = "inline-block";

    let [add_button, label_button] = document.querySelectorAll("#phone-button, #phone-button-label");
    add_button.style.display = "None";
    label_button.style.display = "None";

    view_phone.style.display = "inline-block";
}

function del_button() {
    let [new_phone, del_button, view_phone] = document.querySelectorAll("#phone2, #phone-button2, #number2-view");
    new_phone.style.display = "None";
    del_button.style.display = "None";

    let [add_button, label_button] = document.querySelectorAll("#phone-button, #phone-button-label");
    add_button.style.display = "inline-block";
    label_button.style.display = "inline-block";

    view_phone.style.display = "None";
}