document.addEventListener("DOMContentLoaded", () => {

  const toast = document.getElementById("toast");

  function showToast(message) {

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);

  }


  /* =========================
     CALCULADORA
  ========================= */

  const amount = document.getElementById("amount");
  const days = document.getElementById("days");
  const capital = document.getElementById("capital");
  const profit = document.getElementById("profit");
  const total = document.getElementById("total");

  const rates = {
    1: 0.65,
    7: 0.75,
    15: 0.85,
    30: 1
  };


  function calculate() {

    const value = Math.min(
      1000,
      Math.max(20, Number(amount?.value) || 20)
    );

    const selectedDays =
      Number(days?.value) || 7;

    const rate =
      rates[selectedDays] || 0.75;

    const gain =
      value * (rate / 100) * selectedDays;

    if (amount) {
      amount.value = value;
    }

    if (capital) {
      capital.textContent =
        `$${value.toFixed(2)}`;
    }

    if (profit) {
      profit.textContent =
        `$${gain.toFixed(2)}`;
    }

    if (total) {
      total.textContent =
        `$${(value + gain).toFixed(2)}`;
    }

  }


  amount?.addEventListener(
    "input",
    calculate
  );

  days?.addEventListener(
    "change",
    calculate
  );

  calculate();


  /* =========================
     SELECCIONAR PLAN
  ========================= */

  document
    .querySelectorAll(".select")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const selectedDays =
            Number(button.dataset.days);

          if (days) {
            days.value =
              String(selectedDays);
          }

          calculate();

          document
            .getElementById("calculadora")
            ?.scrollIntoView({
              behavior: "smooth"
            });

          showToast(
            `Plan seleccionado: ${selectedDays} día${selectedDays === 1 ? "" : "s"}`
          );

        }
      );

    });

 /* =========================
   REFERIDOS
========================= */

const refCode = document.getElementById("refCode");
const copyRef = document.getElementById("copyRef");

function generateReferralCode(address) {

  if (!address) {
    return "NEXTORA-DEMO";
  }

  return "NXT-" + address
    .slice(2, 8)
    .toUpperCase();

}


function updateReferralCode(address) {

  if (!refCode) return;

  refCode.textContent =
    generateReferralCode(address);

}


copyRef?.addEventListener(
  "click",
  async () => {

    const code =
      refCode?.textContent?.trim() || "";

    if (!code) return;

    try {

      await navigator.clipboard.writeText(code);

      showToast(
        "Código de referido copiado"
      );

    } catch {

      showToast(
        `Código: ${code}`
      );

    }

  }
); 



  /* =========================
     COPIAR BILLETERAS
  ========================= */

  document
    .querySelectorAll(".copy-wallet")
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          const address =
            button.dataset.copy;

          try {

            await navigator.clipboard
              .writeText(address);

            showToast(
              "Dirección de billetera copiada correctamente"
            );

          } catch {

            showToast(
              address
            );

          }

        }
      );

    });


  /* =========================
     DEPÓSITOS
  ========================= */

  document
    .querySelectorAll(
      '[data-action="deposit"]'
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const network =
            button.dataset.network;

          showToast(
            `Red seleccionada: ${network}. Verifica la dirección antes de enviar fondos.`
          );

        }
      );

    });


  /* =========================
     RETIROS
  ========================= */

  document
    .querySelector(
      '[data-action="withdraw"]'
    )
    ?.addEventListener(
      "click",
      () => {

        showToast(
          "Solicitud de retiro. Comisión: 3%."
        );

      }
    );


  /* =========================
     CONECTAR BILLETERA
  ========================= */

  const connectBtn =
    document.getElementById(
      "connectBtn"
    );

  connectBtn?.addEventListener(
    "click",
    async () => {

      if (!window.ethereum) {

        showToast(
          "Instala MetaMask o una billetera Web3 compatible."
        );

        return;

      }

      try {

        const accounts =
          await window.ethereum.request({
            method:
              "eth_requestAccounts"
          });

    if (accounts?.[0]) {

  const address =
    accounts[0];

  connectBtn.textContent =
    `${address.slice(0, 6)}…${address.slice(-4)}`;

  updateReferralCode(address);

  showToast(
    "Billetera conectada correctamente."
  );

    }    

      } catch (error) {

        if (error?.code !== 4001) {

          showToast(
            "No se pudo conectar la billetera."
          );

        }

      }

    }
  );


  /* =========================
     MENÚ MÓVIL
  ========================= */

  const topbar =
    document.querySelector(".topbar");

  const nav =
    document.querySelector(".topbar nav");

  if (topbar && nav) {

    const menuButton =
      document.createElement("button");

    menuButton.className =
      "menu-toggle";

    menuButton.type =
      "button";

    menuButton.setAttribute(
      "aria-label",
      "Abrir menú"
    );

    menuButton.innerHTML = "☰";

    topbar.insertBefore(
      menuButton,
      nav
    );

    menuButton.addEventListener(
      "click",
      () => {

        nav.classList.toggle(
          "open"
        );

      }
    );

    nav
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {

            nav.classList.remove(
              "open"
            );

          }
        );

      });

  }

});
