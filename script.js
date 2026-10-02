
// ========================================
// PEGANDO OS ELEMENTOS DO HTML
// ========================================

const duracao = document.querySelector("#duracao");

const valor = document.querySelector("#valor");

const botao = document.querySelector("#btnReservar");

const resumo = document.querySelector("#resumo");

const local = document.querySelector("#local");

const data = document.querySelector("#data");

const horariosDisponiveis =
    document.querySelector("#horariosDisponiveis");


// ========================================
// PREÇOS
// ========================================

const precos = {

    "1": 50,

    "2": 80,

    "7": 120

};


// ========================================
// HORÁRIOS DISPONÍVEIS
// ========================================

const horarios = [

    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00"

];


// ========================================
// ALTERAÇÃO DA DURAÇÃO
// ========================================

duracao.addEventListener("change", function () {

    if (duracao.value === "1") {

        valor.textContent = "R$ 50,00";

    }

    else if (duracao.value === "2") {

        valor.textContent = "R$ 80,00";

    }

    else if (duracao.value === "7") {

        valor.textContent = "R$ 120,00";

    }

    else {

        valor.textContent = "R$ 0,00";

    }

});


// ========================================
// PEGAR RESERVAS SALVAS
// ========================================

function pegarReservas() {

    const reservasSalvas =
        localStorage.getItem("reservas");


    if (reservasSalvas) {

        return JSON.parse(reservasSalvas);

    }


    return [];

}


// ========================================
// SALVAR RESERVAS
// ========================================

function salvarReservas(reservas) {

    localStorage.setItem(

        "reservas",

        JSON.stringify(reservas)

    );

}


// ========================================
// CONVERTER HORÁRIO PARA MINUTOS
// ========================================

function horarioEmMinutos(horario) {

    const partes =
        horario.split(":");


    const horas =
        Number(partes[0]);


    const minutos =
        Number(partes[1]);


    return (horas * 60) + minutos;

}


// ========================================
// VERIFICAR CONFLITO
// ========================================

function existeConflito(
    novaReserva,
    reservas
) {

    for (const reserva of reservas) {


        // Mesma data?

        if (
            reserva.data !==
            novaReserva.data
        ) {

            continue;

        }


        // Mesmo local?

        if (
            reserva.local !==
            novaReserva.local
        ) {

            continue;

        }


        // Início da reserva existente

        const inicioExistente =
            horarioEmMinutos(
                reserva.horario
            );


        // Fim da reserva existente

        const fimExistente =
            inicioExistente +
            (reserva.duracao * 60);


        // Início da nova reserva

        const inicioNova =
            horarioEmMinutos(
                novaReserva.horario
            );


        // Fim da nova reserva

        const fimNova =
            inicioNova +
            (novaReserva.duracao * 60);


        // Verifica sobreposição

        if (

            inicioNova < fimExistente &&

            fimNova > inicioExistente

        ) {

            return true;

        }

    }


    return false;

}


// ========================================
// MOSTRAR DISPONIBILIDADE
// ========================================

function mostrarDisponibilidade() {


    horariosDisponiveis.innerHTML = "";


    // Se não selecionou local ou data

    if (
        local.value === "" ||
        data.value === ""
    ) {

        horariosDisponiveis.innerHTML = `

            <p>
                Selecione uma data e um local
                para visualizar os horários.
            </p>

        `;

        return;

    }


    // Pega as reservas existentes

    const reservas =
        pegarReservas();


    // Percorre todos os horários

    horarios.forEach(function (horario) {


        let ocupado = false;


        // Verifica cada reserva

        reservas.forEach(function (reserva) {


            // Verifica data e local

            if (

                reserva.data === data.value &&

                reserva.local === local.value

            ) {


                // Início da reserva existente

                const inicioReserva =
                    horarioEmMinutos(
                        reserva.horario
                    );


                // Fim da reserva existente

                const fimReserva =
                    inicioReserva +
                    (reserva.duracao * 60);


                // Início do horário analisado

                const inicioHorario =
                    horarioEmMinutos(
                        horario
                    );


                // Fim do horário analisado

                const fimHorario =
                    inicioHorario + 60;


                // Verifica conflito

                if (

                    inicioHorario < fimReserva &&

                    fimHorario > inicioReserva

                ) {

                    ocupado = true;

                }

            }

        });


        // Mostra o resultado

        if (ocupado) {


            horariosDisponiveis.innerHTML += `

                <div class="horario-ocupado">

                    🔴 ${horario} — Ocupado

                </div>

            `;


        }

        else {


            horariosDisponiveis.innerHTML += `

                <div class="horario-disponivel">

                    🟢 ${horario} — Disponível

                </div>

            `;

        }

    });

}


// ========================================
// BOTÃO SOLICITAR RESERVA
// ========================================

botao.addEventListener(
    "click",
    function () {


        // Dados do formulário

        const nome =
            document.querySelector("#nome").value;


        const whatsapp =
            document.querySelector("#whatsapp").value;


        const localSelecionado =
            local.value;


        const dataSelecionada =
            data.value;


        const horario =
            document.querySelector("#horario").value;


        const duracaoSelecionada =
            duracao.value;


        // ========================================
        // VALIDAÇÃO
        // ========================================

        if (

            nome === "" ||

            whatsapp === "" ||

            localSelecionado === "" ||

            dataSelecionada === "" ||

            horario === "" ||

            duracaoSelecionada === ""

        ) {


            alert(

                "Por favor, preencha todos os campos antes de solicitar a reserva."

            );


            return;

        }


        // ========================================
        // NOVA RESERVA
        // ========================================

        const novaReserva = {


            nome: nome,


            whatsapp: whatsapp,


            local: localSelecionado,


            data: dataSelecionada,


            horario: horario,


            duracao:
                Number(duracaoSelecionada),


            preco:
                precos[duracaoSelecionada]

        };


        // ========================================
        // PEGAR RESERVAS
        // ========================================

        const reservas =
            pegarReservas();


        // ========================================
        // VERIFICAR CONFLITO
        // ========================================

        if (
            existeConflito(
                novaReserva,
                reservas
            )
        ) {


            alert(

                "❌ Esse horário já está reservado para este local."

            );


            return;

        }


// ========================================
// SALVAR RESERVA NO BANCO
// ========================================

fetch("/reservas", {
    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(novaReserva)
})
.then(function (resposta) {
    return resposta.json();
})
.then(function (dados) {

    console.log("Reserva salva:", dados);

})
.catch(function (erro) {

    console.error("Erro ao salvar reserva:", erro);

});



        // ========================================
        // FORMATAR DATA
        // ========================================

        const dataFormatada =
            dataSelecionada
                .split("-")
                .reverse()
                .join("/");


        // ========================================
        // MOSTRAR RESUMO
        // ========================================

        resumo.style.display =
            "block";


        resumo.innerHTML = `

            <h3>
                ✅ Reserva solicitada
            </h3>


            <p>
                <strong>Cliente:</strong>
                ${nome}
            </p>


            <p>
                <strong>WhatsApp:</strong>
                ${whatsapp}
            </p>


            <p>
                <strong>Local:</strong>
                ${localSelecionado}
            </p>


            <p>
                <strong>Data:</strong>
                ${dataFormatada}
            </p>


            <p>
                <strong>Horário:</strong>
                ${horario}
            </p>


            <p>
                <strong>Duração:</strong>
                ${duracaoSelecionada} hora(s)
            </p>


            <p>
                <strong>Valor:</strong>
                R$ ${novaReserva.preco},00
            </p>


            <a
                class="whatsapp"
                href="#"
                id="btnWhatsApp"
                target="_blank"
            >
                Confirmar pelo WhatsApp
            </a>

        `;


        // ========================================
        // MENSAGEM DO WHATSAPP
        // ========================================

        const mensagem = `

Olá! Gostaria de solicitar uma reserva da máquina de bolas de tênis.

Nome: ${nome}

WhatsApp: ${whatsapp}

Local: ${localSelecionado}

Data: ${dataFormatada}

Horário: ${horario}

Duração: ${duracaoSelecionada} hora(s)

Valor: R$ ${novaReserva.preco},00

Aguardo a confirmação da disponibilidade e as informações para pagamento.

`;


        // ========================================
        // WHATSAPP
        // ========================================

        const numeroWhatsApp =
            "5579998231410";


        const linkWhatsApp =

            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;


        document.querySelector(
            "#btnWhatsApp"
        ).href = linkWhatsApp;


        // Atualiza a disponibilidade

        mostrarDisponibilidade();

    }
);


// ========================================
// ATUALIZAR DISPONIBILIDADE
// ========================================

local.addEventListener(
    "change",
    function () {

        mostrarDisponibilidade();

    }
);


data.addEventListener(
    "change",
    function () {

        mostrarDisponibilidade();

    }
);