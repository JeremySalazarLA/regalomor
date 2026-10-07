const svgNS = "http://www.w3.org/2000/svg";

const tulipsLayer = document.getElementById("tulipsLayer");
const startBtn = document.getElementById("startBtn");
const introCard = document.getElementById("introCard");
const finalContent = document.getElementById("finalContent");
const backgroundMusic = document.getElementById("backgroundMusic");
const bouquetScene = document.getElementById("bouquetScene");

let started = false;


/* Crear SVG */

function createSVG(tag, attrs = {}) {
  const el = document.createElementNS(svgNS, tag);

  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });

  return el;
}


/* Crear pétalo */

function makePetal(gradientId, rotate = 0, scale = 1) {
  const group = createSVG("g", {
    transform: `rotate(${rotate}) scale(${scale})`
  });

  const path =
    "M 0 -78 C 28 -72 46 -22 14 12 C 6 22 -6 22 -14 12 C -46 -22 -28 -72 0 -78 Z";

  group.append(
    createSVG("path", {
      d: path,
      fill: `url(#${gradientId})`,
      class: "petal-fill"
    }),

    createSVG("path", {
      d: path,
      class: "sketch"
    }),

    createSVG("path", {
      d: "M 0 -68 C 2 -40 2 -14 0 10",
      class: "sketch",
      "stroke-width": "1.4"
    })
  );

  return group;
}


/* Crear hoja */

function makeLeaf(rotate, scale, x, y) {
  const group = createSVG("g", {
    transform: `translate(${x} ${y}) rotate(${rotate}) scale(${scale})`
  });

  const path =
    "M 0 0 C 25 -28 66 -38 104 -12 C 74 0 50 10 8 44 C 0 26 -4 12 0 0 Z";

  group.append(
    createSVG("path", {
      d: path,
      fill: "url(#leafGradient)",
      class: "leaf-fill"
    }),

    createSVG("path", {
      d: path,
      class: "sketch"
    }),

    createSVG("path", {
      d: "M 4 3 C 30 0 54 10 82 0",
      class: "sketch",
      "stroke-width": "1.2"
    })
  );

  return group;
}


/* Crear tulipán */

function makeTulip({ x, y, scale, rotation, theme }) {
  const group = createSVG("g", {
    transform: `translate(${x} ${y}) rotate(${rotation}) scale(${scale})`,
    class: "tulipGroup"
  });

  const colors = {
    coral: "coralPetal",
    rose: "rosePetal",
    white: "whitePetal"
  };

  const gradient = colors[theme] || "coralPetal";

  group.appendChild(
    createSVG("ellipse", {
      cx: 0,
      cy: 10,
      rx: 74,
      ry: 52,
      fill: "#5b3131",
      class: "tulip-shadow"
    })
  );

  [
    [-140, 0.95, -32, 34],
    [-18, 0.92, 30, 42],
    [155, 0.82, -12, 54]
  ].forEach(args => {
    group.appendChild(makeLeaf(...args));
  });

  [
    [-70, 0.96],
    [-25, 1.02],
    [22, 1.02],
    [68, 0.95],
    [-118, 0.92],
    [118, 0.92],
    [0, 1.08]
  ].forEach(([rotation, petalScale]) => {
    group.appendChild(
      makePetal(gradient, rotation, petalScale)
    );
  });

  group.appendChild(
    createSVG("ellipse", {
      cx: 0,
      cy: 6,
      rx: 20,
      ry: 15,
      fill: theme === "white" ? "#ccb5ad" : "#4f2025",
      class: "center-fill"
    })
  );

  return group;
}


/* Animar tulipán */

function animateTulip(tulip, delay) {
  const shadow = tulip.querySelector(".tulip-shadow");

  if (shadow) {
    shadow.style.animationDelay = `${delay + 3600}ms`;
    shadow.classList.add("animate-shadow");
  }

  tulip.querySelectorAll(".sketch").forEach((element, i) => {
    element.style.animationDelay = `${delay + i * 120}ms`;
    element.classList.add("animate-sketch");
  });

  tulip
    .querySelectorAll(".petal-fill, .leaf-fill, .center-fill")
    .forEach((element, i) => {
      element.style.animationDelay =
        `${delay + 3600 + i * 90}ms`;

      element.classList.add("animate-fill");
    });
}


/* Construir ramo */

function buildBouquet() {
  tulipsLayer.innerHTML = "";

  const tulips = [
    [500, 470, 1.03, -3, "coral"],
    [418, 435, 0.97, -22, "rose"],
    [585, 430, 1, 18, "white"],
    [442, 555, 1, 16, "white"],
    [570, 555, 1.02, -16, "coral"]
  ];

  tulips.forEach((data, index) => {
    const tulip = makeTulip({
      x: data[0],
      y: data[1],
      scale: data[2],
      rotation: data[3],
      theme: data[4]
    });

    tulipsLayer.appendChild(tulip);

    animateTulip(tulip, index * 7000);
  });
}


/* Mostrar contenido final */

function showFinalContent() {
  finalContent.classList.remove("hidden");
  finalContent.classList.add("show");
}


/* Comenzar experiencia */

startBtn.addEventListener("click", () => {
  if (started) return;

  started = true;

  bouquetScene.classList.add("scene-visible");

  introCard.classList.add("hide");

  backgroundMusic.currentTime = 0;
  backgroundMusic.volume = 0.6;

  backgroundMusic.play().catch(error => {
    console.error("Error con la música:", error);
  });

  buildBouquet();

  setTimeout(() => {
    introCard.style.display = "none";
  }, 900);

  setTimeout(showFinalContent, 35000);
});