# Onde o middleware foi colocado

No Program.cs, o app.UseExceptionHandler(...) foi colocado logo depois de var app = builder.Build(); e antes de app.UseCors(...), app.UseDefaultFiles(), app.UseStaticFiles() e de todos os mapeamentos app.Map.... Assim ele envolve a execução das rotas e consegue capturar exceções lançadas durante o processamento.

# Resultado do teste temporário

Teste feito com a API em ambiente Production (dotnet run --no-launch-profile).

Método: GET
Rota: /api/teste-erro
Status recebido: 500 iternal server error 
Corpo recebido (JSON):
{
  "mensagem": "Ocorreu um erro interno. Tente novamente mais tarde."
}

A frase "Falha simulada para teste." não apareceu na resposta.

Depois do teste, a rota /api/teste-erro foi removida e o dotnet build foi executado novamente: Construir êxito em 70,2s

#  Resultado do teste de ID inexistente
Método: GET
Rota: /api/cafes/90
Status recebido: 404 not found
Corpo recebido: ....

Também testei um endpoint normal (GET /api/cafes), que retornou o status 200ok

#  Por que não enviar a mensagem bruta da exceção ao cliente

A mensagem bruta da exceção pode revelar detalhes internos da aplicação (caminhos de arquivos, nomes de tabelas, trechos de consulta ao banco), que ajudam um atacante e não servem ao usuário, então o cliente recebe uma mensagem genérica e o detalhe fica apenas no log do servidor

https://drive.google.com/file/d/1SMvcfQpIhKDKjt85EOO76VZPYJNJ7Jy7/view?usp=drive_link, por exemplo ![teste-erro], sem nomes, endereços ou dados pessoais.