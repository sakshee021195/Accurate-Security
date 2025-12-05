import NotoDevanagari from "./NotoSansDevanagari.txt";

export function registerNotoDevFont(jsPDF) {
    jsPDF.API.events.push([
        "addFonts",
        function () {
            this.addFileToVFS("NotoDev.ttf", NotoDevanagari);
            this.addFont("NotoDev.ttf", "NotoDev", "normal");
            this.addFont("NotoDev.ttf", "NotoDev", "bold");
        }
    ]);
}
