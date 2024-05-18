/**
 * @name CustomClockDisplay
 * @author SG
 * @authorLink https://www.youtube.com/@sg-hacking3099
 * @description Un plugin de visualización de reloj personalizable que te permite mostrar la hora en tu pantalla con varias opciones de formato y posicionamiento.
 * @version 0.1
 * @website https://www.youtube.com/@sg-hacking3099
 */

class CustomClockDisplay
{
    constructor()
    {
        this.settings = this.loadSettings();
        if (!this.settings) {
            this.settings = {
                showClock: true,
                timeFormat: '12h',
                textColor: '#ffffff',
                textSize: '2rem',
                position: 'center',
                allowMouseMovement: true
            };
        }
    }

    getName()
    {
        return "Custom Clock Display";
    }

    getDescription()
    {
        return "A customizable clock display plugin that allows you to show the time on your screen with various formatting and positioning options.";
    }

    getVersion()
    {
        return "0.1";
    }

    getAuthor()
    {
        return "SG";
    }

    getSettingsPanel()
    {
        // Crear panel de configuración
        const panel = document.createElement("div");
        panel.style.padding = "10px";

        // Opción Mostrar/Ocultar Reloj
        const showClockCheckbox = document.createElement("input");
        showClockCheckbox.type = "checkbox";
        showClockCheckbox.checked = this.settings.showClock;
        showClockCheckbox.addEventListener("change", () => {
            this.settings.showClock = showClockCheckbox.checked;
            if (this.settings.showClock) {
                this.start();
            } else {
                this.stop();
            }
            this.saveSettings();
        }
    );

        // Opción "Mostrar Reloj"
        const showClockLabel = document.createElement("label");
        showClockLabel.innerText = "Mostrar Reloj";
        showClockLabel.style.color = "#a0a0a0"; // Color gris claro
        showClockLabel.appendChild(showClockCheckbox);
        panel.appendChild(showClockLabel);
        panel.appendChild(document.createElement("br"));

        // Opción "Formato de Hora"
        const timeFormatSelect = document.createElement("select");
        const twelveHourOption = document.createElement("option");
        twelveHourOption.value = "12h";
        twelveHourOption.text = "12 horas";
        const twentyFourHourOption = document.createElement("option");
        twentyFourHourOption.value = "24h";
        twentyFourHourOption.text = "24 horas";
        timeFormatSelect.appendChild(twelveHourOption);
        timeFormatSelect.appendChild(twentyFourHourOption);
        timeFormatSelect.value = this.settings.timeFormat;
        timeFormatSelect.addEventListener("change", () => {
            this.settings.timeFormat = timeFormatSelect.value;
        });

        const timeFormatLabel = document.createElement("label");
        timeFormatLabel.innerText = "Formato de Hora: ";
        timeFormatLabel.style.color = "#a0a0a0"; // Color gris claro
        timeFormatLabel.appendChild(timeFormatSelect);
        panel.appendChild(timeFormatLabel);
        panel.appendChild(document.createElement("br"));

        // Opción "Color de Texto"
        const textColorInput = document.createElement("input");
        textColorInput.type = "color";
        textColorInput.value = this.settings.textColor;
        textColorInput.addEventListener("input", () => {
            this.settings.textColor = textColorInput.value;
            if (this.clockElement)
            {
                this.clockElement.style.color = this.settings.textColor;
            }
        });

        const textColorLabel = document.createElement("label");
        textColorLabel.innerText = "Color de Texto: ";
        textColorLabel.style.color = "#a0a0a0"; // Color gris claro
        textColorLabel.appendChild(textColorInput);
        panel.appendChild(textColorLabel);
        panel.appendChild(document.createElement("br"));

        // Opción "Tamaño de Texto"
        const textSizeInput = document.createElement("input");
        textSizeInput.type = "text";
        textSizeInput.value = this.settings.textSize;
        textSizeInput.addEventListener("input", () => {
            this.settings.textSize = textSizeInput.value;
            if (!this.settings.textSize.endsWith("rem"))
            {
                this.settings.textSize += "rem";
            }
            if (this.clockElement)
            {
                this.clockElement.style.fontSize = this.settings.textSize;
            }
        });

        const textSizeLabel = document.createElement("label");
        textSizeLabel.innerText = "Tamaño de Texto: ";
        textSizeLabel.style.color = "#a0a0a0"; // Color gris claro
        textSizeLabel.appendChild(textSizeInput);
        panel.appendChild(textSizeLabel);
        panel.appendChild(document.createElement("br"));

        // Opción "Posición"
        const positionSelect = document.createElement("select");
        const positions = ["arriba-izquierda", "arriba-centro", "arriba-derecha", "centro-izquierda", "centro", "centro-derecha", "abajo-izquierda", "abajo-centro", "abajo-derecha"];
        positions.forEach(position =>
        {
            const option = document.createElement("option");
            option.value = position;
            option.text = position.replace("-", " ");
            positionSelect.appendChild(option);
        });
        positionSelect.value = this.settings.position;
        positionSelect.addEventListener("change", () =>
        {
            this.settings.position = positionSelect.value;
            if (this.clockElement)
            {
                this.updateClockPosition();
            }
        });

        const positionLabel = document.createElement("label");
        positionLabel.innerText = "Posición: ";
        positionLabel.style.color = "#a0a0a0"; // Color gris claro
        positionLabel.appendChild(positionSelect);
        panel.appendChild(positionLabel);
        panel.appendChild(document.createElement("br"));

        // Opción "Grosor de Texto"
        const fontWeightSelect = document.createElement("select");
        const normalOption = document.createElement("option");
        normalOption.value = "normal";
        normalOption.text = "Normal";
        const boldOption = document.createElement("option");
        boldOption.value = "bold";
        boldOption.text = "Negrita";
        fontWeightSelect.appendChild(normalOption);
        fontWeightSelect.appendChild(boldOption);
        fontWeightSelect.value = this.settings.fontWeight;
        fontWeightSelect.addEventListener("change", () =>
        {
            this.settings.fontWeight = fontWeightSelect.value;
            if (this.clockElement)
            {
                this.clockElement.style.fontWeight = this.settings.fontWeight;
            }
        });

        const fontWeightLabel = document.createElement("label");
        fontWeightLabel.innerText = "Grosor de Texto: ";
        fontWeightLabel.style.color = "#a0a0a0"; // Color gris claro
        fontWeightLabel.appendChild(fontWeightSelect);
        panel.appendChild(fontWeightLabel);
        panel.appendChild(document.createElement("br"));
        
        // Opción "Decoración de Texto"
        const textDecorationSelect = document.createElement("select");
        const noneOption = document.createElement("option");
        noneOption.value = "none";
        noneOption.text = "Ninguno";
        const underlineOption = document.createElement("option");
        underlineOption.value = "underline";
        underlineOption.text = "Subrayar";
        const overlineOption = document.createElement("option");
        overlineOption.value = "overline";
        overlineOption.text = "Sobrelínea";
        const lineThroughOption = document.createElement("option");
        lineThroughOption.value = "line-through";
        lineThroughOption.text = "Tachado";
        textDecorationSelect.appendChild(noneOption);
        textDecorationSelect.appendChild(underlineOption);
        textDecorationSelect.appendChild(overlineOption);
        textDecorationSelect.appendChild(lineThroughOption);
        textDecorationSelect.value = this.settings.textDecoration;
        textDecorationSelect.addEventListener("change", () =>
        {
            this.settings.textDecoration = textDecorationSelect.value;
            if (this.clockElement)
            {
                this.clockElement.style.textDecoration = this.settings.textDecoration;
            }
        });

        const textDecorationLabel = document.createElement("label");
        textDecorationLabel.innerText = "Decoración de Texto: ";
        textDecorationLabel.style.color = "#a0a0a0"; // Color gris claro
        textDecorationLabel.appendChild(textDecorationSelect);
        panel.appendChild(textDecorationLabel);
        panel.appendChild(document.createElement("br"));

        // Opción "Estilo de Texto"
        const fontStyleSelect = document.createElement("select");
        const normalFontStyleOption = document.createElement("option");
        normalFontStyleOption.value = "normal";
        normalFontStyleOption.text = "Normal";
        const italicOption = document.createElement("option");
        italicOption.value = "italic";
        italicOption.text = "Cursiva";
        fontStyleSelect.appendChild(normalFontStyleOption);
        fontStyleSelect.appendChild(italicOption);
        fontStyleSelect.value = this.settings.fontStyle;
        fontStyleSelect.addEventListener("change", () =>
        {
            this.settings.fontStyle = fontStyleSelect.value;
            if (this.clockElement)
            {
                this.clockElement.style.fontStyle = this.settings.fontStyle;
            }
        });

        const fontStyleLabel = document.createElement("label");
        fontStyleLabel.innerText = "Estilo de Texto: ";
        fontStyleLabel.style.color = "#a0a0a0"; // Color gris claro
        fontStyleLabel.appendChild(fontStyleSelect);
        panel.appendChild(fontStyleLabel);
        panel.appendChild(document.createElement("br"));

        //  Opción "Mouse"
        const allowMouseMovementCheckbox = document.createElement("input");
        allowMouseMovementCheckbox.type = "checkbox";
        allowMouseMovementCheckbox.checked = this.settings.allowMouseMovement;
        allowMouseMovementCheckbox.addEventListener("change", () =>
        {
            this.settings.allowMouseMovement = allowMouseMovementCheckbox.checked;
            if (!this.settings.allowMouseMovement)
            {
                this.removeMouseHandlers();
            }
        });

        /*const allowMouseMovementLabel = document.createElement("label");
        allowMouseMovementLabel.innerText = "Allow Mouse Movement";
        allowMouseMovementLabel.style.color = "#a0a0a0"; // Color gris claro
        allowMouseMovementLabel.appendChild(allowMouseMovementCheckbox);
        panel.appendChild(allowMouseMovementLabel);
        panel.appendChild(document.createElement("br"));*/

        return panel;
    }

    removeMouseHandlers()
    {
        if (this.clockElement)
        {
            this.clockElement.removeEventListener("mousedown", this.handleMouseDown);
        }
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    start() {
        // Verificar si el reloj debe mostrarse
        if (!this.settings.showClock) return;

        // Crear el elemento del reloj
        this.clockElement = document.createElement('div');
        this.clockElement.id = 'customClock';
        this.clockElement.style.position = 'fixed'; // Posición fija en la pantalla
        this.clockElement.style.fontSize = this.settings.textSize; // Tamaño del texto
        this.clockElement.style.fontWeight = this.settings.fontWeight; // Peso de la fuente
        this.clockElement.style.color = this.settings.textColor; // Color del texto
        this.clockElement.style.textShadow = '0px 0px 4px rgba(0,0,0,0.5)'; // Sombra del texto
        this.clockElement.style.zIndex = "1000"; // Asegura que el reloj esté en el frente
        this.clockElement.style.pointerEvents = "auto"; // Permitir eventos del ratón
        document.body.appendChild(this.clockElement); // Añadir el reloj al cuerpo del documento

        // Actualizar el reloj y su posición
        this.updateClock();
        this.updateClockPosition();

        // Añadir manejadores de eventos para movimiento del reloj con el ratón
        this.clockElement.addEventListener("mousedown", this.handleMouseDown.bind(this));
        document.addEventListener("mouseup", this.handleMouseUp.bind(this));

        // Actualizar el reloj cada segundo
        this.clockInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    handleMouseDown(event) {
        // Iniciar el arrastre
        this.dragging = true;
        // Calcular la posición inicial del ratón en relación con el reloj
        this.initialX = event.clientX - this.clockElement.getBoundingClientRect().left;
        this.initialY = event.clientY - this.clockElement.getBoundingClientRect().top;
        // Añadir el evento de movimiento del ratón
        document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    }

    handleMouseMove(event) {
        // Verificar si se está arrastrando
        if (this.dragging) {
            // Calcular la nueva posición del reloj
            const newX = event.clientX - this.initialX;
            const newY = event.clientY - this.initialY;
            // Actualizar la posición del reloj
            this.clockElement.style.left = newX + "px";
            this.clockElement.style.top = newY + "px";

            // Si el reloj se mueve con el ratón, establecer la posición como personalizada
            this.settings.position = "custom";
            this.settings.positionX = this.clockElement.style.left;
            this.settings.positionY = this.clockElement.style.top;
        }
    }

    handleMouseUp() {
        // Terminar el arrastre
        this.dragging = false;
        // Remover el evento de movimiento del ratón
        document.removeEventListener("mousemove", this.handleMouseMove.bind(this));
        // Guardar la configuración
        this.saveSettings();
    }

    stop() {
        // Detener el reloj
        if (this.clockElement) {
            // Quitar el elemento del DOM si existe
            this.clockElement.remove();
        }
        // Limpiar el intervalo de actualización si está en funcionamiento
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
        // Remover los event listeners para el arrastre
        this.clockElement.removeEventListener("mousedown", this.handleMouseDown.bind(this));
        document.removeEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    updateClock() {
        // Obtener la hora actual
        const now = new Date();
        // Obtener las horas y minutos
        let hours = now.getHours();
        const minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

        // Formatear la hora según la configuración
        if (this.settings.timeFormat === '12h') {
            hours = hours > 12 ? hours - 12 : hours;
            hours = hours === 0 ? 12 : hours;
            const period = hours >= 12 ? 'PM' : 'AM';
            this.clockElement.innerText = `${hours}:${minutes} ${period}`;
        } else {
            hours = (hours < 10 ? '0' : '') + hours;
            this.clockElement.innerText = `${hours}:${minutes}`;
        }

        // Aplicar decoración de texto
        this.clockElement.style.textDecoration = this.settings.textDecoration;
        // Aplicar estilo de fuente
        this.clockElement.style.fontStyle = this.settings.fontStyle;
    }

    updateClockPosition() {
        // Si la posición es personalizada, establecerla según las coordenadas guardadas
        if (this.settings.position === "custom") {
            this.clockElement.style.left = this.settings.positionX;
            this.clockElement.style.top = this.settings.positionY;
            return; // Salir si la posición es personalizada
        }

        // Si no es personalizada, utilizar las posiciones predefinidas
        const positions = this.settings.position.split("-");
        const [vertical, horizontal] = positions;

        if (vertical === "top") {
            this.clockElement.style.top = "20px";
            this.clockElement.style.bottom = "auto";
        } else if (vertical === "center") {
            this.clockElement.style.top = "50%";
            this.clockElement.style.transform = "translate(-50%, -50%)";
        } else if (vertical === "bottom") {
            this.clockElement.style.top = "auto";
            this.clockElement.style.bottom = "20px";
        }

        if (horizontal === "left") {
            this.clockElement.style.left = "20px";
            this.clockElement.style.right = "auto";
            this.clockElement.style.transform = "";
        } else if (horizontal === "center") {
            this.clockElement.style.left = "50%";
            this.clockElement.style.transform = "translateX(-50%)";
            this.clockElement.style.right = "auto";
        } else if (horizontal === "right") {
            this.clockElement.style.left = "auto";
            this.clockElement.style.right = "20px";
            this.clockElement.style.transform = "";
        }
    }

    saveSettings() {
        // Guarda las coordenadas X e Y actuales del reloj solo si la posición es "custom"
        if (this.settings.position === "custom") {
            this.settings.positionX = this.clockElement.style.left;
            this.settings.positionY = this.clockElement.style.top;
        }

        // Guarda la configuración en el almacenamiento local
        BdApi.saveData("CustomClockDisplay", "settings", JSON.stringify(this.settings));
    }

    loadSettings() {
        try {
            // Cargar la configuración guardada del almacenamiento local
            return JSON.parse(BdApi.loadData("CustomClockDisplay", "settings"));
        } catch (error) {
            // Manejar errores al cargar la configuración
            console.error('Error al cargar la configuración:', error);
            return null;
        }
    }
};
