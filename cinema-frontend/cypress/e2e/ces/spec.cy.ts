describe('login system', () => {
    it('login test', () => {
        cy.visit('http://localhost:3000' +
            '')
        cy.get('[data-testid="login"]').click();
        cy.get('[name="email"]').click();
        cy.get('[name="email"]').type('dbarfield4@gmail.com');
        cy.get('[name="password"]').click();
        cy.get('[name="password"]').type('1234');
        cy.get('[name="rememberMe"]').check();
        cy.get('[data-testid="loginFormSubmit"]').click();
        cy.wait(1000);
        cy.get('[data-testid="logout"]').should('have.text', 'Logout')
    });

    it('logout', function () {
        cy.visit('http://localhost:3000')
        cy.get('button.bg-white').click();
        cy.get('[name="email"]').click();
        cy.get('[name="email"]').type('dbarfield4@gmail.com');
        cy.get('[name="password"]').type('1234');
        cy.get('button.w-full').click();
        cy.get('div.flex.gap-4 button:nth-child(3)').click();
        cy.get('[data-testid="login"]').should('have.text', 'Login');
    });

    it('Edit Profile', function () {
        cy.visit('http://localhost:3000')
        cy.get('[data-testid="login"]').click();
        cy.get('[name="email"]').click();
        cy.get('[name="email"]').type('dbarfield4@gmail.com');
        cy.get('[name="password"]').click();
        cy.get('[name="password"]').type('1234');
        cy.get('[data-testid="loginFormSubmit"]').click();
        cy.get('[data-testid="editProfile"]').click();

        cy.get('[data-testid="expandHomeAddress"]').click();
        cy.get('[data-testid="expandPaymentMethods"]').click();
        cy.get('[data-testid="expandChangePassword"]').click();


        cy.get('#username').clear().type('newUsername');
        cy.get('#firstName').clear().type('newFirstName');
        cy.get('#lastName').clear().type('newLastName');
        cy.get('#phoneNumber').clear().type('7701238822');
        cy.get("#submitProfileChange").click();
        cy.wait(500);
        cy.get('#successMessage').contains('Profile successfully updated!');

        cy.get('#street').clear().type('newStreet');
        cy.get('#city').clear().type('newCity');
        cy.get('#state').clear().type('AL');
        cy.get('#zip').clear().type('12345');
        cy.get("#submitAddressChange").click();
        cy.wait(500);
        cy.get('#successMessage').contains('Address successfully updated!');

        cy.get('#cardNumber').clear().type('1111222233334444')
        cy.get('#cardExpMonth').clear().type("8")
        cy.get('#cardExpYear').clear().type("2025")
        cy.get('#cardBillingStreet').clear().type("1234 New Address")
        cy.get('#cardBillingCity').clear().type("New City")
        cy.get('#cardBillingState').clear().type("AL")
        cy.get('#cardBillingZip').clear().type("12345")
        cy.get("#submitPaymentChange").click();
        cy.wait(500)
        cy.get('#successMessage').contains('Payment info successfully updated!');

        cy.reload();

        cy.get('[data-testid="expandHomeAddress"]').click();
        cy.get('[data-testid="expandPaymentMethods"]').click();
        cy.get('[data-testid="expandChangePassword"]').click();

        cy.get('#username').should('have.value','newUsername');
        cy.get('#firstName').should('have.value','newFirstName');
        cy.get('#lastName').should('have.value','newLastName');
        cy.get('#phoneNumber').should('have.value','+1 770 123 8822');

        cy.get('#street').should('have.value','newStreet');
        cy.get('#city').should('have.value','newCity');
        cy.get('#state').should('have.value','AL');
        cy.get('#zip').should('have.value','12345');

        cy.get('#cardExpMonth').should('have.value',"8")
        cy.get('#cardExpYear').should('have.value',"2025")
        cy.get('#cardBillingStreet').should('have.value',"1234 New Address")
        cy.get('#cardBillingCity').should('have.value',"New City")
        cy.get('#cardBillingState').should('have.value',"AL")
        cy.get('#cardBillingZip').should('have.value',"12345")
    });
})