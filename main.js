document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Hero Typewriter Effect
    const textToType = "Diseñamos estrategias que permiten a las marcas evolucionar.";
    const typingElement = document.getElementById('typewriter');
    let index = 0;

    function typeWriter() {
        if (!typingElement) return;
        if (index < textToType.length) {
            typingElement.textContent += textToType.charAt(index);
            index++;
            setTimeout(typeWriter, 50); // Speed of typing
        }
    }

    // Start typing after a short delay
    setTimeout(typeWriter, 500);

    // 2. Framework Interactive Nodes
    const frameworkData = {
        comprender: {
            title: "Comprender",
            text: "Exploramos el contexto de negocio, auditoría de marca, tendencias del mercado y análisis de competencia para hallar oportunidades reales."
        },
        escuchar: {
            title: "Escuchar",
            text: "Conectamos con la audiencia a través de etnografías, entrevistas y social listening para descubrir motivadores subyacentes."
        },
        interpretar: {
            title: "Interpretar",
            text: "Sintetizamos la data en 'insights' accionables. Encontramos el significado oculto que marca la diferencia competitiva."
        },
        disenar: {
            title: "Diseñar",
            text: "Conceptualizamos soluciones tangibles: desde el posicionamiento y la identidad, hasta modelos de servicio y experiencia."
        },
        activar: {
            title: "Activar",
            text: "Traducimos la estrategia en lineamientos operativos, comunicación y planes go-to-market que generan impacto medible."
        }
    };

    const nodes = document.querySelectorAll('.node');
    const labels = document.querySelectorAll('.framework-labels span');
    const stepRows = document.querySelectorAll('.framework-step-row');
    const lines = document.querySelectorAll('.line');
    const descTitle = document.getElementById('desc-title');
    const descText = document.getElementById('desc-text');
    const descBadge = document.getElementById('desc-badge');
    const descContainer = document.getElementById('framework-desc');
    const stepOrder = ['comprender', 'escuchar', 'interpretar', 'disenar', 'activar'];

    function activateStep(stepName) {
        if(!descContainer) return;
        
        // Remove active class from all nodes, labels, rows
        nodes.forEach(n => n.classList.remove('active'));
        labels.forEach(l => l.classList.remove('active'));
        stepRows.forEach(r => r.classList.remove('active'));

        // Add to targeted
        const targetNode = document.querySelector(`.node[data-step="${stepName}"]`);
        const targetLabel = document.querySelector(`.framework-labels span[data-step="${stepName}"]`);
        const targetRow = document.querySelector(`.framework-step-row[data-step="${stepName}"]`);
        
        if (targetNode) targetNode.classList.add('active');
        if (targetLabel) targetLabel.classList.add('active');
        if (targetRow) targetRow.classList.add('active');

        // Highlight connector lines up to active step
        const activeIndex = stepOrder.indexOf(stepName);
        lines.forEach((line, i) => {
            if (i < activeIndex) {
                line.classList.add('active-line');
            } else {
                line.classList.remove('active-line');
            }
        });

        // Strong fade-out → content swap → fade-in
        descContainer.classList.remove('fade-in', 'is-active');
        descContainer.classList.add('fade-out');
        
        setTimeout(() => {
            if (frameworkData[stepName]) {
                if (descTitle) descTitle.textContent = frameworkData[stepName].title;
                if (descText) descText.textContent = frameworkData[stepName].text;
                if (descBadge) descBadge.textContent = activeIndex + 1;
            }
            descContainer.classList.remove('fade-out');
            descContainer.classList.add('fade-in', 'is-active');
        }, 320);
    }

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            activateStep(node.dataset.step);
        });
        node.addEventListener('mouseenter', () => {
            activateStep(node.dataset.step);
        });
    });

    labels.forEach(label => {
        label.addEventListener('click', () => {
            activateStep(label.dataset.step);
        });
        label.addEventListener('mouseenter', () => {
            activateStep(label.dataset.step);
        });
    });

    // Mobile step rows (click only, no mouseenter on mobile)
    stepRows.forEach(row => {
        row.addEventListener('click', () => {
            activateStep(row.dataset.step);
        });
    });

    // Auto-activate first step on load
    activateStep('comprender');

    // 3. Step Form Logic with WhatsApp Hybrid Notification
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const formSteps = document.querySelectorAll('.form-step');
    const form = document.getElementById('qualifyForm');

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Validation step
            const currentStep = btn.closest('.form-step');
            const inputs = currentStep.querySelectorAll('input[required], select[required]');
            let valid = true;
            
            inputs.forEach(input => {
                if(!input.value) valid = false;
            });

            if(!valid) {
                alert("Por favor, completa los campos requeridos.");
                return;
            }

            const target = btn.dataset.next;
            formSteps.forEach(step => step.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.prev;
            formSteps.forEach(step => step.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Gather Data
            const name = document.getElementById('name').value;
            const company = document.getElementById('company').value;
            const challenge = document.getElementById('challenge').value;
            let stage = '';
            document.querySelectorAll('input[name="stage"]').forEach(radio => {
                if(radio.checked) stage = radio.value;
            });

            // Format Message
            const message = `*Nuevo Prospecto Alto Valor - LLYF*\n\n` +
                            `👤 *Nombre:* ${name}\n` +
                            `🏢 *Empresa:* ${company}\n\n` +
                            `🎯 *Reto Actual:* ${challenge}\n` +
                            `📈 *Etapa de Marca:* ${stage}\n\n` +
                            `_Generado vía LLYF Insights Platform_`;

            // Encode for WhatsApp
            const encodedMessage = encodeURIComponent(message);
            const whatsappNumber = "5215555555555"; // Replace with actual LLYF number
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Also trigger mailto fallback or primary action
            const mailtoLink = `mailto:contacto@llyf.com?subject=Diagnóstico de Marca: ${company}&body=${encodeURIComponent("Hola,\n\nSolicito un diagnóstico de marca. Mis datos son:\nNombre: " + name + "\nEmpresa: " + company + "\nReto: " + challenge + "\nEtapa: " + stage + "\n\nSaludos.")}`;

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Open Mail in background
            window.location.href = mailtoLink;

            // Reset and show success (simulate)
            form.innerHTML = `<div style="text-align:center; padding: 2rem;">
                                <h3 style="margin-bottom:1rem; color: var(--bg-black);">¡Evaluación Recibida!</h3>
                                <p style="color:var(--slate-gray);">Se ha notificado de inmediato a uno de nuestros estrategas vía WhatsApp y correo. Nos comunicaremos contigo en breve.</p>
                            </div>`;
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        // In the updated light theme, the navbar starts transparent 
        // and becomes a solid white background with a shadow.
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

});
