
export function getMarkerHtml() {
  return `
    <div style="
      transform: translate(-50%, -100%);
      text-align: center;
    ">
      <div style="
        background-color: #2DC7FF;
        padding: 6px 10px;
        border-radius: 4px;
        color: white;
        font-size: 13px;
        font-weight: bold;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        margin-bottom: 4px;
      ">
        מיקום הנכס
      </div>
      <div style="
        width: 2px;
        height: 20px;
        background: linear-gradient(to bottom, #2DC7FF, transparent);
        margin: 0 auto;
      "></div>
    </div>
  `;
}
