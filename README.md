# Setup de projetos backend

## Primeiros passos
 - rodar *yarn add* para instalar as dependencias do projeto
 - verificar se a porta do docker que rodara o projeto já não está rodando outro (porta padrão 5432)
 - rodar docker-compose up -d para subir o container de banco do projeto
 - rodar o projeto usando yarn start:dev
 - criar um model no prisma com um model da modelagem e subistituir as tipagens e referencias do model com o nome example <br/> e realizar as migrations (caso os novos models sejam muito diferentes exclua a pasta migrations, antes de subir pra o servidor pela primeira vez)