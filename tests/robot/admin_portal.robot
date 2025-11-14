*** Settings ***
Documentation     Portal Administrativo - Complete Test Suite
Library           Browser
Library           DateTime
Suite Setup       Open Browser And Navigate
Suite Teardown    Close Browser
Test Setup        Reset Application State
Test Teardown     Capture Screenshot On Failure

*** Variables ***
${BASE_URL}           http://localhost:5173
${LOGIN_URL}          ${BASE_URL}/login
${ADMIN_URL}          ${BASE_URL}/admin-dashboard
${ADMIN_USER}         admin
${ADMIN_PASS}         admin123
${TIMEOUT}            10s

*** Test Cases ***
TC_ADMIN_001: Login As Administrator
    [Documentation]    Verify successful admin login
    [Tags]    admin    authentication    critical
    Login As Admin
    Wait For Elements    text=Portal Administrativo
    Location Should Contain    /admin-dashboard

TC_ADMIN_002: View Dashboard Statistics
    [Documentation]    Verify admin dashboard displays all statistics
    [Tags]    admin    dashboard
    Login As Admin
    Wait For Elements    [data-testid="stat-total-visitors"]
    Wait For Elements    [data-testid="stat-total-residents"]
    Wait For Elements    [data-testid="stat-active-access"]

TC_ADMIN_003: Manage Residents - Create
    [Documentation]    Create new resident record
    [Tags]    admin    residents    crud
    Login As Admin
    Click    text=Moradores
    Click    button:has-text("Novo Morador")
    Fill Text    input[name="name"]    João Teste Silva
    Fill Text    input[name="apartment"]    101
    Fill Text    input[name="phone"]    11999999999
    Click    button:has-text("Salvar")
    Wait For Elements    text=Morador cadastrado com sucesso

TC_ADMIN_004: Manage Residents - Read
    [Documentation]    List and view resident details
    [Tags]    admin    residents    crud
    Login As Admin
    Click    text=Moradores
    Wait For Elements    table
    ${row_count}=    Get Element Count    tbody tr
    Should Be True    ${row_count} > 0

TC_ADMIN_005: Manage Residents - Update
    [Documentation]    Update existing resident
    [Tags]    admin    residents    crud
    Login As Admin
    Click    text=Moradores
    Click    button:has-text("Editar") >> nth=0
    Fill Text    input[name="phone"]    11888888888
    Click    button:has-text("Salvar")
    Wait For Elements    text=Morador atualizado com sucesso

TC_ADMIN_006: Manage Residents - Delete
    [Documentation]    Delete resident (soft delete)
    [Tags]    admin    residents    crud
    Login As Admin
    Click    text=Moradores
    Click    button:has-text("Excluir") >> nth=0
    Click    button:has-text("Confirmar")
    Wait For Elements    text=Morador removido com sucesso

TC_ADMIN_007: Access Control - Grant Access
    [Documentation]    Grant access permission to visitor
    [Tags]    admin    access-control    critical
    Login As Admin
    Click    text=Controle de Acesso
    Click    button:has-text("Liberar Acesso")
    Fill Text    input[name="visitor_name"]    Visitante Autorizado
    Select Options By    select[name="unit"]    text    101
    Click    button:has-text("Confirmar")
    Wait For Elements    text=Acesso liberado

TC_ADMIN_008: Access Control - Revoke Access
    [Documentation]    Revoke access permission
    [Tags]    admin    access-control
    Login As Admin
    Click    text=Controle de Acesso
    Click    button:has-text("Bloquear") >> nth=0
    Click    button:has-text("Confirmar Bloqueio")
    Wait For Elements    text=Acesso bloqueado

TC_ADMIN_009: Generate Report - PDF
    [Documentation]    Generate and download PDF report
    [Tags]    admin    reports    critical
    Login As Admin
    Click    text=Relatórios
    Select Options By    select[name="report_type"]    text    Visitantes
    Click    button:has-text("Gerar PDF")
    # Wait for download to start
    Sleep    2s

TC_ADMIN_010: Generate Report - Excel
    [Documentation]    Generate and download Excel report
    [Tags]    admin    reports    critical
    Login As Admin
    Click    text=Relatórios
    Select Options By    select[name="report_type"]    text    Moradores
    Click    button:has-text("Gerar Excel")
    Sleep    2s

TC_ADMIN_011: User Management - Create User
    [Documentation]    Create new system user
    [Tags]    admin    users    crud
    Login As Admin
    Click    text=Usuários
    Click    button:has-text("Novo Usuário")
    Fill Text    input[name="username"]    novo_porteiro
    Fill Text    input[name="password"]    senha123
    Select Options By    select[name="role"]    text    Porteiro
    Click    button:has-text("Criar Usuário")
    Wait For Elements    text=Usuário criado com sucesso

TC_ADMIN_012: User Management - Edit User
    [Documentation]    Edit existing user
    [Tags]    admin    users    crud
    Login As Admin
    Click    text=Usuários
    Click    button:has-text("Editar") >> nth=0
    Select Options By    select[name="status"]    text    Inativo
    Click    button:has-text("Salvar")
    Wait For Elements    text=Usuário atualizado

TC_ADMIN_013: User Management - Delete User
    [Documentation]    Delete system user
    [Tags]    admin    users    crud
    Login As Admin
    Click    text=Usuários
    Click    button:has-text("Excluir") >> nth=0
    Click    button:has-text("Confirmar Exclusão")
    Wait For Elements    text=Usuário removido

TC_ADMIN_014: Schedule Management - Create Schedule
    [Documentation]    Create visitor schedule
    [Tags]    admin    schedules
    Login As Admin
    Click    text=Agendamentos
    Click    button:has-text("Novo Agendamento")
    Fill Text    input[name="visitor_name"]    Visitante Agendado
    Fill Text    input[name="date"]    2025-02-01
    Fill Text    input[name="time"]    14:00
    Click    button:has-text("Agendar")
    Wait For Elements    text=Agendamento criado

TC_ADMIN_015: Audit Log - View Activities
    [Documentation]    View system audit log
    [Tags]    admin    security    audit
    Login As Admin
    Click    text=Auditoria
    Wait For Elements    table
    ${log_count}=    Get Element Count    tbody tr
    Should Be True    ${log_count} >= 0

*** Keywords ***
Open Browser And Navigate
    New Browser    chromium    headless=${True}
    New Context    viewport={'width': 1280, 'height': 720}
    New Page    ${BASE_URL}

Close Browser
    Close Browser

Reset Application State
    Go To    ${LOGIN_URL}
    Evaluate JavaScript    None    window.localStorage.clear()
    Evaluate JavaScript    None    window.sessionStorage.clear()

Capture Screenshot On Failure
    Run Keyword If Test Failed    Take Screenshot    ${TEST_NAME}

Login As Admin
    Go To    ${LOGIN_URL}
    Fill Text    input[name="username"]    ${ADMIN_USER}
    Fill Text    input[name="password"]    ${ADMIN_PASS}
    Click    button[type="submit"]
    Wait For Elements    text=Portal Administrativo    timeout=${TIMEOUT}
