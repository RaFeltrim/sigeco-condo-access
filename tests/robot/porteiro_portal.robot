*** Settings ***
Documentation     Portal do Porteiro - Complete Test Suite
Library           Browser
Library           DateTime
Library           String
Library           Collections
Suite Setup       Open Browser And Navigate
Suite Teardown    Close Browser
Test Setup        Reset Application State
Test Teardown     Capture Screenshot On Failure

*** Variables ***
${BASE_URL}           http://localhost:5173
${LOGIN_URL}          ${BASE_URL}/login
${PORTEIRO_URL}       ${BASE_URL}/porteiro-dashboard
${ADMIN_URL}          ${BASE_URL}/admin-dashboard
${USERNAME}           porteiro
${PASSWORD}           senha123
${TIMEOUT}            10s
${SCREENSHOT_DIR}     test-results/robot/screenshots

*** Test Cases ***
TC001: Login With Valid Credentials
    [Documentation]    Verify successful login with porteiro credentials
    [Tags]    authentication    critical    smoke
    Login As Porteiro
    Wait For Elements    text=Portal do Porteiro
    Location Should Contain    /porteiro-dashboard

TC002: Login With Invalid Credentials
    [Documentation]    Verify error message for invalid credentials
    [Tags]    authentication    negative
    Go To    ${LOGIN_URL}
    Type Text    input[name="username"]    invalid_user
    Type Text    input[name="password"]    wrong_pass
    Click    button[type="submit"]
    Wait For Elements    text=Credenciais inválidas

TC003: Register Visitor Entry - All Fields
    [Documentation]    Register visitor with all required and optional fields
    [Tags]    visitor-registration    critical
    Login As Porteiro
    Fill Text    input[name="name"]    João Silva
    Fill Text    input[name="document"]    12345678901
    Select Options By    select[name="destination"]    text    Apto 101
    Fill Text    textarea[name="purpose"]    Visita familiar
    Click    button:has-text("Registrar Entrada")
    Wait For Elements    text=Entrada registrada com sucesso
    Wait For Elements    text=João Silva

TC004: Register Visitor Entry - Required Fields Only
    [Documentation]    Register visitor with only required fields
    [Tags]    visitor-registration
    Login As Porteiro
    Fill Text    input[name="name"]    Maria Santos
    Fill Text    input[name="document"]    98765432100
    Select Options By    select[name="destination"]    text    Apto 102
    Click    button:has-text("Registrar Entrada")
    Wait For Elements    text=Entrada registrada com sucesso
    Wait For Elements    text=Maria Santos

TC005: Validate Required Fields
    [Documentation]    Verify validation messages for empty required fields
    [Tags]    validation    negative
    Login As Porteiro
    Click    button:has-text("Registrar Entrada")
    Wait For Elements    text=Nome é obrigatório
    Wait For Elements    text=Documento é obrigatório
    Wait For Elements    text=Destino é obrigatório

TC006: Validate Name Field - Minimum Length
    [Documentation]    Verify name validation (minimum 3 characters)
    [Tags]    validation    negative
    Login As Porteiro
    Fill Text    input[name="name"]    Ab
    Fill Text    input[name="document"]    12345678901
    Select Options By    select[name="destination"]    text    Apto 103
    Click    button:has-text("Registrar Entrada")
    Wait For Elements    text=Nome deve ter no mínimo 3 caracteres

TC007: Validate Document Field - CPF Format
    [Documentation]    Verify CPF validation (11 digits)
    [Tags]    validation    negative
    Login As Porteiro
    Fill Text    input[name="name"]    Pedro Costa
    Fill Text    input[name="document"]    123
    Select Options By    select[name="destination"]    text    Apto 104
    Click    button:has-text("Registrar Entrada")
    Wait For Elements    text=CPF deve ter 11 dígitos

TC008: Validate Document Field - RG Format
    [Documentation]    Verify RG validation (9 digits)
    [Tags]    validation
    Login As Porteiro
    Fill Text    input[name="name"]    Ana Oliveira
    Fill Text    input[name="document"]    123456789
    Select Options By    select[name="destination"]    text    Apto 105
    Click    button:has-text("Registrar Entrada")
    Wait For Elements    text=Entrada registrada com sucesso

TC009: Automatic Document Formatting - CPF
    [Documentation]    Verify automatic CPF formatting (###.###.###-##)
    [Tags]    formatting
    Login As Porteiro
    Fill Text    input[name="document"]    12345678901
    ${formatted}=    Get Property    input[name="document"]    value
    Should Be Equal    ${formatted}    123.456.789-01

TC010: Prevent Duplicate Entry
    [Documentation]    Verify system prevents duplicate visitor entries
    [Tags]    validation    negative    critical
    Login As Porteiro
    # First entry
    Fill Text    input[name="name"]    Carlos Lima
    Fill Text    input[name="document"]    11122233344
    Select Options By    select[name="destination"]    text    Apto 201
    Click    button:has-text("Registrar Entrada")
    Wait For Elements    text=Entrada registrada com sucesso
    # Try duplicate
    Fill Text    input[name="name"]    Carlos Lima
    Fill Text    input[name="document"]    11122233344
    Select Options By    select[name="destination"]    text    Apto 201
    Click    button:has-text("Registrar Entrada")
    Wait For Elements    text=Visitante já está no prédio

TC011: Register Visitor Exit
    [Documentation]    Register visitor exit and verify duration calculation
    [Tags]    visitor-exit    critical
    Login As Porteiro
    Register Test Visitor    Julia Mendes    55566677788    Apto 301
    Click    button:has-text("Saída")
    Wait For Elements    text=Saída registrada
    Wait For Elements    text=Duração

TC012: Prevent Duplicate Exit
    [Documentation]    Verify system prevents duplicate exit registration
    [Tags]    validation    negative
    Login As Porteiro
    Register Test Visitor    Roberto Silva    99988877766    Apto 302
    Click    button:has-text("Saída")
    Wait For Elements    text=Saída registrada
    Sleep    1s
    # Button should be disabled or visitor marked as exited
    ${button_count}=    Get Element Count    button:has-text("Saída")
    Should Be Equal As Numbers    ${button_count}    0

TC013: Quick Checkout - Search By Name
    [Documentation]    Use quick checkout to register visitor exit by name
    [Tags]    quick-checkout    critical
    Login As Porteiro
    Register Test Visitor    Fernanda Costa    44455566677    Apto 401
    Fill Text    input[placeholder*="Pronto para Saída"]    Fernanda
    Wait For Elements    text=Fernanda Costa
    Click    text=Fernanda Costa
    Click    button:has-text("Confirmar Saída")
    Wait For Elements    text=Saída registrada

TC014: Quick Checkout - Search By Document
    [Documentation]    Use quick checkout to register visitor exit by document
    [Tags]    quick-checkout
    Login As Porteiro
    Register Test Visitor    Paulo Andrade    33344455566    Apto 402
    Fill Text    input[placeholder*="Pronto para Saída"]    333444
    Wait For Elements    text=Paulo Andrade

TC015: Visitor Search - By Name
    [Documentation]    Search visitor history by name
    [Tags]    search
    Login As Porteiro
    Register Test Visitor    Lucia Martins    22233344455    Apto 501
    Fill Text    input[placeholder*="Buscar"]    Lucia
    Click    button:has-text("Buscar")
    Wait For Elements    text=Resultados

TC016: Visitor Search - By Document
    [Documentation]    Search visitor history by document
    [Tags]    search
    Login As Porteiro
    Fill Text    input[placeholder*="Buscar"]    12345678901
    Click    button:has-text("Buscar")
    Wait For Elements    text=Resultados

TC017: Visitor Search - By Destination
    [Documentation]    Search visitors by destination
    [Tags]    search
    Login As Porteiro
    Fill Text    input[placeholder*="Buscar"]    Apto 101
    Click    button:has-text("Buscar")
    Wait For Elements    text=Destino

TC018: Display Visitor History
    [Documentation]    View complete visitor history
    [Tags]    history
    Login As Porteiro
    Register Test Visitor    Marcos Pereira    66677788899    Apto 601
    Fill Text    input[placeholder*="Buscar"]    Marcos Pereira
    Click    button:has-text("Buscar")
    Click    text=Marcos Pereira
    Wait For Elements    text=Histórico de Visitas

TC019: Dashboard Statistics - Visitors Today
    [Documentation]    Verify visitors today count is displayed
    [Tags]    dashboard    statistics
    Login As Porteiro
    Wait For Elements    [data-testid="stat-visitors-today"]
    ${count}=    Get Text    [data-testid="stat-visitors-today"]
    Should Match Regexp    ${count}    \\d+

TC020: Dashboard Statistics - Active Visitors
    [Documentation]    Verify active visitors count is displayed
    [Tags]    dashboard    statistics
    Login As Porteiro
    Wait For Elements    [data-testid="stat-active-now"]
    ${count}=    Get Text    [data-testid="stat-active-now"]
    Should Match Regexp    ${count}    \\d+

TC021: Dashboard Statistics - Weekly Total
    [Documentation]    Verify weekly total is displayed
    [Tags]    dashboard    statistics
    Login As Porteiro
    Wait For Elements    [data-testid="stat-week-total"]
    ${count}=    Get Text    [data-testid="stat-week-total"]
    Should Match Regexp    ${count}    \\d+

TC022: Dashboard Statistics - Trend Indicators
    [Documentation]    Verify trend indicators are shown
    [Tags]    dashboard    statistics
    Login As Porteiro
    ${trend_count}=    Get Element Count    [data-testid*="trend"]
    Should Be True    ${trend_count} > 0

TC023: Data Persistence After Reload
    [Documentation]    Verify visitor data persists after page reload
    [Tags]    persistence    critical
    Login As Porteiro
    Register Test Visitor    Teste Persistencia    77788899900    Apto 701
    Reload
    Wait For Elements    text=Teste Persistencia

TC024: Clear Old Data
    [Documentation]    Verify old data cleanup functionality
    [Tags]    data-management
    Login As Porteiro
    Click    button:has-text("Limpar Dados Antigos")
    Wait For Elements    text=Dados antigos removidos

TC025: Accessibility - Keyboard Navigation
    [Documentation]    Verify keyboard navigation works properly
    [Tags]    accessibility    a11y
    Login As Porteiro
    Press Keys    input[name="name"]    TAB
    ${focused}=    Get Attribute    input:focus    name
    Should Be Equal    ${focused}    document

TC026: Accessibility - ARIA Labels
    [Documentation]    Verify ARIA labels are present
    [Tags]    accessibility    a11y
    Login As Porteiro
    ${aria_label}=    Get Attribute    input[name="name"]    aria-label
    Should Not Be Empty    ${aria_label}

TC027: Accessibility - Form Error Announcements
    [Documentation]    Verify error messages are announced to screen readers
    [Tags]    accessibility    a11y
    Login As Porteiro
    Click    button:has-text("Registrar Entrada")
    ${alert_count}=    Get Element Count    [role="alert"]
    Should Be True    ${alert_count} > 0

TC028: Responsive Design - Mobile Viewport
    [Documentation]    Verify layout works on mobile viewport
    [Tags]    responsive    mobile
    New Context    viewport={'width': 375, 'height': 667}
    New Page    ${LOGIN_URL}
    Login As Porteiro
    Wait For Elements    text=Portal do Porteiro
    Close Page

TC029: Responsive Design - Tablet Viewport
    [Documentation]    Verify layout works on tablet viewport
    [Tags]    responsive    tablet
    New Context    viewport={'width': 768, 'height': 1024}
    New Page    ${LOGIN_URL}
    Login As Porteiro
    Wait For Elements    text=Portal do Porteiro
    Close Page

TC030: Responsive Design - Desktop Viewport
    [Documentation]    Verify layout works on desktop viewport
    [Tags]    responsive    desktop
    New Context    viewport={'width': 1920, 'height': 1080}
    New Page    ${LOGIN_URL}
    Login As Porteiro
    Wait For Elements    text=Portal do Porteiro
    Close Page

TC031: Error Handling - Network Error
    [Documentation]    Verify graceful handling of network errors
    [Tags]    error-handling    negative
    Login As Porteiro
    # Simulate network error
    Fill Text    input[name="name"]    Network Error Test
    Fill Text    input[name="document"]    00000000000
    Select Options By    select[name="destination"]    text    Apto 801
    Click    button:has-text("Registrar Entrada")
    # Should show error message gracefully
    Wait For Elements    text=Erro

TC032: Loading States
    [Documentation]    Verify loading states are displayed during operations
    [Tags]    ux    loading
    Login As Porteiro
    Fill Text    input[name="name"]    Loading Test
    Fill Text    input[name="document"]    11111111111
    Select Options By    select[name="destination"]    text    Apto 901
    Click    button:has-text("Registrar Entrada")
    # Check if button is disabled during loading
    ${disabled}=    Get Property    button:has-text("Registrar")    disabled
    Should Be True    ${disabled} or ${disabled} == 'true'

TC033: Logout Functionality
    [Documentation]    Verify logout clears session and redirects to login
    [Tags]    authentication    critical
    Login As Porteiro
    Click    button:has-text("Sair")
    Wait For Elements    text=Login
    Location Should Contain    /login

TC034: Session Timeout
    [Documentation]    Verify session timeout handling
    [Tags]    authentication    security
    Login As Porteiro
    # Clear session storage
    Evaluate JavaScript    None    window.localStorage.clear()
    Reload
    Location Should Contain    /login

TC035: Multiple Visitor Registration - Batch
    [Documentation]    Register multiple visitors in sequence
    [Tags]    batch    performance
    Login As Porteiro
    FOR    ${index}    IN RANGE    5
        ${name}=    Set Variable    Visitante${index}
        ${doc}=    Evaluate    str(10000000000 + ${index})
        Register Test Visitor    ${name}    ${doc}    Apto 10${index}
        Sleep    0.5s
    END
    ${visitor_count}=    Get Element Count    tr:has-text("Visitante")
    Should Be True    ${visitor_count} >= 5

*** Keywords ***
Open Browser And Navigate
    New Browser    chromium    headless=${True}
    New Context    viewport={'width': 1280, 'height': 720}    recordVideo={'dir': '${SCREENSHOT_DIR}'}
    New Page    ${BASE_URL}

Close Browser
    Close Browser

Reset Application State
    Go To    ${LOGIN_URL}
    Evaluate JavaScript    None    window.localStorage.clear()
    Evaluate JavaScript    None    window.sessionStorage.clear()

Capture Screenshot On Failure
    Run Keyword If Test Failed    Take Screenshot    ${TEST_NAME}

Login As Porteiro
    Go To    ${LOGIN_URL}
    Fill Text    input[name="username"]    ${USERNAME}
    Fill Text    input[name="password"]    ${PASSWORD}
    Click    button[type="submit"]
    Wait For Elements    text=Portal do Porteiro    timeout=${TIMEOUT}

Register Test Visitor
    [Arguments]    ${name}    ${document}    ${destination}
    Fill Text    input[name="name"]    ${name}
    Fill Text    input[name="document"]    ${document}
    Select Options By    select[name="destination"]    text    ${destination}
    Click    button:has-text("Registrar Entrada")
    Wait For Elements    text=Entrada registrada com sucesso    timeout=${TIMEOUT}
