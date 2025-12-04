const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver'); // Certifique-se de ter instalado: npm install chromedriver

(async function executarTestes() {
    // Inicializa o navegador Chrome
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // AJUSTE AQUI: A URL onde seu projeto está rodando
        const baseUrl = 'http://localhost:3000'; 
        
        console.log("\n=== INICIANDO BATERIA DE TESTES AUTOMATIZADOS ===\n");

        // ---------------------------------------------------------
        // TESTE 01: Login Negativo (Tentar logar com senha errada)
        // ---------------------------------------------------------
        console.log(">> Executando CT_01: Login com credenciais inválidas...");
        await driver.get(baseUrl);
        
        // 1. Clicar no botão "Login" do menu (ID confirmado no layout.ejs)
        await driver.findElement(By.id('btn-login')).click();
        
        // 2. Esperar o modal abrir (ID confirmado no home.ejs)
        let modal = driver.findElement(By.id('login-modal'));
        await driver.wait(until.elementIsVisible(modal), 5000);

        // 3. Preencher dados inválidos
        await driver.findElement(By.id('login-email')).sendKeys('teste@erro.com');
        await driver.findElement(By.id('login-password')).sendKeys('senha123');
        
        // 4. Clicar em Entrar
        await driver.findElement(By.id('login-submit')).click();

        // 5. Verificar (Como o seu site usa 'alert', vamos capturá-lo)
        try {
            await driver.wait(until.alertIsPresent(), 5000);
            let alert = await driver.switchTo().alert();
            let textoAlerta = await alert.getText();
            console.log(`   [SUCESSO] Alerta exibido: "${textoAlerta}"`);
            await alert.accept(); // Fecha o alerta
        } catch (e) {
            console.log("   [FALHA] Nenhum alerta de erro apareceu.");
        }

        // ---------------------------------------------------------
        // TESTE 02: Personalização (Cálculo de Preço Positivo)
        // ---------------------------------------------------------
        console.log("\n>> Executando CT_02: Cálculo de Preço do Sabonete...");
        await driver.navigate().refresh(); // Recarrega para limpar
        
        // Aguarda carregar as opções do Firebase (dropdowns)
        await driver.sleep(3000); 

        // 1. Selecionar Forma (ID: forma)
        // Nota: O selenium precisa enviar as teclas para selecionar, pois o option é dinâmico
        let selectForma = await driver.findElement(By.id('forma'));
        await selectForma.sendKeys(Key.ARROW_DOWN); 
        await selectForma.sendKeys(Key.ENTER);

        // 2. Definir Quantidade (ID: quantidade)
        let inputQtd = await driver.findElement(By.id('quantidade'));
        await inputQtd.clear();
        await inputQtd.sendKeys('2');

        // 3. Verificar se o total apareceu (ID: preco-total)
        // O script.js calcula automaticamente ao mudar o input
        let totalTexto = await driver.findElement(By.id('preco-total')).getText();
        
        if(totalTexto.includes("Total: R$")) {
            console.log(`   [SUCESSO] Cálculo realizado: ${totalTexto}`);
        } else {
            console.log("   [FALHA] O preço total não foi atualizado.");
        }

        // ---------------------------------------------------------
        // TESTE 03: Formulário de Contato (Preenchimento)
        // ---------------------------------------------------------
        console.log("\n>> Executando CT_03: Preenchimento do Contato...");
        await driver.get(baseUrl + '/faleconosco'); // Ou a rota correta onde está o form

        // IMPORTANTE: No seu contato.ejs, os inputs NÃO têm ID, apenas NAME.
        // Por isso usamos By.name() aqui.
        await driver.findElement(By.name('name')).sendKeys('Tester Selenium');
        await driver.findElement(By.name('email')).sendKeys('tester@email.com');
        await driver.findElement(By.name('message')).sendKeys('Testando envio de mensagem automatizada.');
        
        // Clica no botão de enviar (que é o único button dentro do main .contato)
        await driver.findElement(By.css('.contato button[type="submit"]')).click();

        console.log("   [SUCESSO] Formulário submetido.");

    } catch (erro) {
        console.error("ERRO FATAL NO TESTE:", erro);
    } finally {
        // Fecha o navegador ao terminar
        await driver.quit();
    }
})();
