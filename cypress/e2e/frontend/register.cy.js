describe('Front-end - Registro', () => {
	const uniqueUser = () => {
		const suffix = Date.now();

		return {
			username: `admin${suffix}`,
			email: `admin${suffix}@labprice.com`,
			password: 'senha123'
		};
	};

	beforeEach(() => {
		cy.clearLocalStorage();
		cy.visit('/register.html');
		cy.contains('Cadastro').should('be.visible');
	});

	it('TC-FE-001: Registro com sucesso na página register.html', () => {
		const user = uniqueUser();

		cy.intercept('POST', '/auth/register').as('register');

		cy.get('#username').type(user.username);
		cy.get('#email').type(user.email);
		cy.get('#password').type(user.password);
		cy.contains('button', 'Cadastrar').click();

		cy.wait('@register').its('response.statusCode').should('eq', 201);
		cy.location('pathname').should('include', 'login.html');
		cy.window().then((win) => {
			expect(win.localStorage.getItem('labprice_token')).to.be.null;
			expect(win.localStorage.getItem('labprice_user')).to.be.null;
		});
	});

	it('TC-FE-002: Bloqueio de caracteres especiais no username', () => {
		cy.intercept('POST', '/auth/register').as('register');

		cy.get('#username').type('admin@123');
		cy.get('#email').type('admin@labprice.com');
		cy.get('#password').type('senha123');
		cy.contains('button', 'Cadastrar').click();

		cy.wait('@register').then(({ response }) => {
			expect(response.statusCode).to.eq(400);
			expect(response.body.error).to.eq('Validação falhou');
			expect(response.body.details[0].msg).to.eq('Username deve conter apenas caracteres alfanuméricos [RN01]');
		});
	});

	it('TC-FE-003: Bloqueio de e-mail mal formatado', () => {
		cy.get('#username').type('admin123');
		cy.get('#email').type('admin.macuxi');
		cy.get('#password').type('senha123');

		cy.get('#registerForm').then(($form) => {
			$form[0].requestSubmit();
		});

		cy.focused().should('have.attr', 'id', 'email');
		cy.get('#email').then(($input) => {
			expect($input[0].checkValidity()).to.be.false;
		});
	});

	it('TC-FE-004: Bloqueio de senha curta', () => {
		cy.intercept('POST', '/auth/register').as('register');

		cy.get('#username').type('admin123');
		cy.get('#email').type('admin@labprice.com');
		cy.get('#password').type('12345');

		cy.get('#registerForm').then(($form) => {
			$form[0].requestSubmit();
		});

		cy.wait('@register').then(({ response }) => {
			expect(response.statusCode).to.eq(400);
			expect(response.body.error).to.eq('Validação falhou');
			expect(response.body.details[0].msg).to.eq('Senha deve ter no mínimo 6 caracteres [RN01]');
		});
	});

	it('TC-FE-005: Campos obrigatórios no registro', () => {
		cy.get('#registerForm').then(($form) => {
			$form[0].requestSubmit();
		});

		cy.focused().should('have.attr', 'id', 'username');
		cy.get('#registerForm').then(($form) => {
			expect($form[0].checkValidity()).to.be.false;
		});
	});
});
