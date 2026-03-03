# Simulador AWS Cloud Practitioner

Un simulador web interactivo completo para practicar y prepararse para la certificación **AWS Cloud Practitioner (CLF-C02)** con más de 165 preguntas de opción múltiple en español.

---

## 🚀 Características

- **165 preguntas** distribuidas en 10 categorías
- **3 modos de estudio**:
  - 📚 **Por Categoría** — enfócate en un servicio específico
  - 🛠️ **Casos Prácticos** — escenarios del mundo real
  - 🎯 **Modo Examen** — mezcla aleatoria de todas las preguntas
- **Feedback inmediato** con explicación detallada de cada respuesta
- **Estadísticas en tiempo real** (respondidas, correctas, porcentaje de aciertos)
- **Barra de progreso** visual durante el quiz
- **Teclas de acceso rápido** (1-4 para opciones, Enter para verificar/siguiente)
- **Persistencia** de progreso en localStorage
- **Diseño responsive** para móvil, tablet y escritorio
- **Sin dependencias externas** — funciona directamente en el navegador

---

## 📂 Estructura del Proyecto

```
simulador-aws/
├── index.html                     # Página principal del simulador
├── styles.css                     # Estilos con paleta AWS (naranja #FF9900, gris #232F3E)
├── script.js                      # Lógica del quiz (JavaScript Vanilla)
├── questions/
│   ├── computo.json               # EC2, Lambda, Elastic Beanstalk (15 preguntas)
│   ├── almacenamiento.json        # S3, EBS, EFS (15 preguntas)
│   ├── base-datos.json            # RDS, DynamoDB, Aurora (20 preguntas)
│   ├── redes.json                 # VPC, CloudFront, Route 53, VPN (20 preguntas)
│   ├── seguridad.json             # IAM, KMS, GuardDuty, Shield (20 preguntas)
│   ├── administracion.json        # CloudWatch, CloudTrail, CloudFormation… (30 preguntas)
│   ├── financiera.json            # Cost Explorer, Budgets (10 preguntas)
│   ├── integracion.json           # SNS, SQS (10 preguntas)
│   ├── conceptos-fundamentales.json  # Shared Responsibility, Well-Architected, Pricing (15 preguntas)
│   └── casos-practicos.json       # Escenarios reales integrados (10 preguntas)
└── README.md
```

---

## 🛠️ Instrucciones de Uso

### Opción 1: Abrir directamente en el navegador
Clona el repositorio y abre `index.html` en cualquier navegador moderno:

```bash
git clone https://github.com/dariojavierguangasi/simulador-aws.git
cd simulador-aws
# Abre index.html en tu navegador
```

> **Nota:** Como el simulador carga archivos JSON mediante `fetch()`, necesitas servirlo desde un servidor HTTP local (no funciona con `file://` en todos los navegadores).

### Opción 2: Servidor local con Python
```bash
# Python 3
python3 -m http.server 8080
# Abre http://localhost:8080 en el navegador
```

### Opción 3: Servidor local con Node.js
```bash
npx serve .
# o
npx http-server .
```

---

## 📋 Categorías de Preguntas

| Categoría | Servicios | Preguntas |
|-----------|-----------|-----------|
| Cómputo | EC2, Lambda, Elastic Beanstalk | 15 |
| Almacenamiento | S3, EBS, EFS | 15 |
| Base de Datos | RDS, DynamoDB, Aurora, SQL vs NoSQL | 20 |
| Redes y Conectividad | VPC, CloudFront, Route 53, VPN | 20 |
| Seguridad y Cumplimiento | IAM, KMS, GuardDuty, Shield | 20 |
| Administración y Gobernanza | CloudWatch, CloudTrail, CloudFormation, Auto Scaling, Organizations, Trusted Advisor | 30 |
| Gestión Financiera | Cost Explorer, Budgets | 10 |
| Integración de Aplicaciones | SNS, SQS | 10 |
| Conceptos Fundamentales | Shared Responsibility, Well-Architected, Pricing | 15 |
| Casos Prácticos | Escenarios reales multi-servicio | 10 |
| **Total** | | **165** |

---

## 🤝 Cómo Contribuir (Agregar Preguntas)

Cada archivo JSON sigue esta estructura:

```json
{
  "categoria": "Nombre de la Categoría",
  "preguntas": [
    {
      "id": 16,
      "pregunta": "Texto claro y preciso de la pregunta",
      "opciones": [
        "Opción A — respuesta correcta",
        "Opción B — distractor plausible",
        "Opción C — distractor plausible",
        "Opción D — distractor plausible"
      ],
      "respuestaCorrecta": 0,
      "explicacion": "Explicación educativa detallada de por qué A es correcta y las demás no."
    }
  ]
}
```

**Lineamientos para nuevas preguntas:**
1. Usar un `id` único y consecutivo dentro del archivo
2. Redactar en estilo de examen real AWS (claro, sin ambigüedades)
3. Incluir 4 opciones plausibles (no opciones obviamente incorrectas)
4. Escribir una explicación educativa de al menos 2 oraciones
5. Validar el JSON antes de hacer pull request

---

## 📚 Recursos Adicionales para Estudiar

- [AWS Cloud Practitioner Essentials (curso oficial gratuito)](https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials)
- [AWS Certified Cloud Practitioner — Guía del examen](https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf)
- [Documentación oficial de AWS](https://docs.aws.amazon.com/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Calculadora de precios de AWS](https://calculator.aws/pricing/2/home)
- [AWS Free Tier](https://aws.amazon.com/free/)

---

## ⚠️ Disclaimer

Este simulador es **material de estudio no oficial** creado con fines educativos. No está afiliado, patrocinado ni respaldado por Amazon Web Services (AWS). El contenido está basado en la documentación pública de AWS y puede no reflejar la versión más reciente del examen.

Para información oficial sobre la certificación, visita [aws.amazon.com/certification](https://aws.amazon.com/certification/).
