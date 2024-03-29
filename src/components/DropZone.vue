<template>
  <div
    class="border border-gray-300 rounded-lg p-4"
    @drop.prevent="addFile"
    @dragover.prevent
  >
    <h2 class="text-lg mb-4 font-semibold">Files to Upload</h2>

    <ul
      class="mb-4 divide-y border-t border-b border-amber-400 bg-amber-50 -mx-4"
    >
      <li v-for="file in files" class="p-3">
        {{ file.name }}
        <span class="text-amber-700 text-xs">
          ({{ Math.floor(file.size / 1024) }} kb)
        </span>
        <button
          class="px-3 py-1 mx-2 text-sm bg-red-300 hover:bg-red-400 rounded-md float-right"
          @click="removeFile(file)"
          title="Remove"
        >
          &#10005;
        </button>
      </li>
      <li v-if="files.length === 0" class="p-3 italic">
        (Drag them over here)
      </li>
    </ul>

    <button
      class="py-2 px-4 mr-2 bg-blue-300 hover:bg-blue-400 rounded-md cursor-pointer"
      :disabled="uploadDisabled"
      @click="upload"
    >
      Start Upload
    </button>
    <button
      v-if="!downloadDisabled"
      class="py-2 px-4 mr-2 bg-green-300 hover:bg-green-400 rounded-md cursor-pointer"
      @click="download"
    >
      Download Excel
    </button>
    <button
      v-if="!downloadDisabled"
      class="py-2 px-4 mr-2 bg-green-300 hover:bg-green-400 rounded-md cursor-pointer"
      @click="downloadDefects"
    >
      Download Defects Excel
    </button>
    <button
      v-if="!downloadDisabled"
      class="py-2 px-4 mr-2 bg-green-300 hover:bg-green-400 rounded-md cursor-pointer"
      @click="downloadStructures"
    >
      Download Structures Excel
    </button>
    <button
      v-if="!downloadDisabled"
      class="py-2 px-4 mr-2 bg-green-300 hover:bg-green-400 rounded-md cursor-pointer"
      @click="downloadEco"
    >
      Download ESG
    </button>
  </div>

  <div class="border rounded-lg p-4">
    <h2 class="text-lg mb-4 font-semibold">Uploaded</h2>

    <ul
      class="mb-4 divide-y border-t border-b border-green-400 bg-green-50 -mx-4"
      v-if="isUploading()"
    >
      <li class="p-3">
        Processing: <span class="text-sm">{{ processingStatus() }}</span>
      </li>
    </ul>

    <ul class="list-decimal px-8">
      <li v-for="file in processedFiles()">{{ file }}</li>
    </ul>
  </div>

  <div class="border rounded-lg p-4">
    <h2 class="text-lg mb-4 font-semibold">Warnings</h2>
    <ul class="list-decimal px-8">
      <li v-for="alert in warnings()">{{ alert }}</li>
    </ul>
  </div>
</template>

<script>
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  COLUMN_NAMES,
  DEFECT_ASSESSMENT_COLUMNS,
  DEFECT_COLUMNS,
  STRUCTURE_COLUMNS,
  ECO_COLUMNS,
} from "../constants/columns";

export default {
  data() {
    return {
      files: [],
      persons: [],
      incoming: [],
      status: "",
    };
  },
  computed: {
    uploadDisabled() {
      return this.files.length === 0;
    },
    downloadDisabled() {
      return Object.keys(this.$store.state.dropzone.data).length === 0;
    },
  },
  methods: {
    warnings() {
      return this.$store.getters.getWarnings;
    },
    processedFiles() {
      return this.$store.getters.getProcessedFiles;
    },
    isUploading() {
      return this.$store.getters.isUploading;
    },
    processingStatus() {
      return this.$store.getters.getIncomingFile;
    },
    addFile(e) {
      let droppedFiles = e.dataTransfer.files;
      if (!droppedFiles) return;

      // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
      [...droppedFiles].forEach((f) => {
        this.files.push(f);
      });

      // this.upload()
    },
    removeFile(file) {
      this.files = this.files.filter((f) => {
        return f != file;
      });
    },
    upload() {
      let reader = new FileReader();

      reader.addEventListener(
        "load",
        () => {
          // load the chunks 5MB at a time
          const CHUNK_SIZE = 5242880;

          let buffer = reader.result;
          let decoder = new TextDecoder();

          // if the file is smaller than 5MB, parse it all at once
          if (buffer.byteLength < CHUNK_SIZE) {
            let decoded = decoder.decode(buffer);
            JSON.parse(decoded).forEach((form) => {
              this.$store.dispatch("PROCESS_SITE", form);
            });
            return;
          }

          let chunks = Math.floor(buffer.byteLength / CHUNK_SIZE);
          let currentForms = "";
          let bracketCount = 0;
          let decoded = decoder.decode(buffer.slice(0, CHUNK_SIZE));
          let bracketRe = /\{|\}/g;

          for (let i = 1; i < chunks; i++) {
            let match;
            let lastClosingBracketIndex = 0;
            while ((match = bracketRe.exec(decoded)) !== null) {
              if (match[0] === "{") bracketCount++;
              else if (match[0] === "}") bracketCount--;

              if (bracketCount === 0) lastClosingBracketIndex = match.index;
            }

            if (lastClosingBracketIndex) {
              currentForms +=
                decoded.slice(0, lastClosingBracketIndex + 1) + "\n]\n";
              currentForms = currentForms.replace(/ObjectId\((.*)\)/g, "$1");
              currentForms = currentForms.replace(/ISODate\((.*)\)/g, "$1");
              JSON.parse(currentForms).forEach((form) => {
                this.$store.dispatch("PROCESS_SITE", form);
              });
              // we go 2 instead of 1 to ignore the comma
              currentForms = "[\n" + decoded.slice(lastClosingBracketIndex + 2);
            } else {
              currentForms += decoded;
            }

            decoded = decoder.decode(
              buffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
            );
          }

          // need to handle last chunk differently, because we can't overflow it
          currentForms += decoded;
          currentForms += decoder.decode(buffer.slice(chunks * CHUNK_SIZE));
          currentForms = currentForms.replace(/ObjectId\((.*)\)/g, "$1");
          currentForms = currentForms.replace(/ISODate\((.*)\)/g, "$1");
          JSON.parse(currentForms).forEach((form) => {
            this.$store.dispatch("PROCESS_SITE", form);
          });
        },
        false
      );

      reader.addEventListener(
        "loadend",
        () => {
          console.log("finished reading file, trying next one...");
          this.$store.commit("FILE_LOADED");
          this.upload();
        },
        false
      );

      // upload first file in queue
      let queuedFile = this.files.shift();

      // safely return if no more files
      if (!queuedFile) {
        this.$store.commit("FINISHED");
        return true;
      }

      this.$store.commit("FILE_PROCESSING", queuedFile.name);

      // Read in the image file as a data URL.
      reader.readAsArrayBuffer(queuedFile);
    },
    download: async function () {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("My Sheet");

      worksheet.columns = COLUMN_NAMES;

      // add styles
      let emeraldBackground = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "96c8a2" },
      };

      let headingFont = {
        size: 12,
      };

      worksheet.getRow(1).alignment = { wrapText: true };
      worksheet.getRow(1).fill = emeraldBackground;
      worksheet.getRow(1).font = headingFont;

      let sites = this.$store.getters.getValidSubmissions;

      let details = this.$store.getters.getSiteDetails;
      let generators = this.$store.getters.getGenerators;
      let batteries = this.$store.getters.getBatteries;
      let rectifiers = this.$store.getters.getRectifiers;
      let acu = this.$store.getters.getAcus;
      let shelters = this.$store.getters.getShelters;

      sites.forEach((site) => {
        let orangeDetails = this.$store.getters.getOrangeDetails(site);

        let transmission_type_from_table =
          this.$store.getters.getTransmissionType(
            site,
            details[site]["transmission_type"]
          );
        // console.log(transmission_type_from_table)

        let towerDetails = this.$store.getters.getTowerDetails(site);

        let countStructures = this.$store.getters.countStructures(site);

        worksheet.addRow({
          id: site,
          ...towerDetails,
          ...orangeDetails,
          ...details[site],
          ...generators[site],
          ...batteries[site],
          ...acu[site],
          ...rectifiers[site],
          ...shelters[site],
          amount_shelters: this.$store.getters.countShelters(site),
          amount_rectifiers: this.$store.getters.countRectifiers(site),
          amount_batteries: this.$store.getters.countBatteries(site),
          amount_acu: this.$store.getters.countAcus(site),
          amount_generators: this.$store.getters.countGenerators(site),
          transmission_type: transmission_type_from_table,
          ...countStructures,
        });
      });

      // file writing
      let myDate = new Date();
      myDate = myDate.toISOString().split("T")[0];

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        saveAs(blob, `${myDate}__Survey Comparisons.xlsx`);
      });
    },
    downloadEco: async function () {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("ESG");

      worksheet.columns = ECO_COLUMNS;

      // add styles
      worksheet.getRow(1).alignment = { wrapText: true };

      let emeraldBackground = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "96c8a2" },
      };

      let headingFont = {
        size: 12,
      };

      worksheet.getCell("A1").fill = emeraldBackground;
      worksheet.getCell("A1").font = headingFont;

      worksheet.getCell("B1").fill = emeraldBackground;
      worksheet.getCell("B1").font = headingFont;

      worksheet.getCell("C1").fill = emeraldBackground;
      worksheet.getCell("C1").font = headingFont;

      worksheet.getCell("D1").fill = emeraldBackground;
      worksheet.getCell("D1").font = headingFont;

      worksheet.getCell("E1").fill = emeraldBackground;
      worksheet.getCell("E1").font = headingFont;

      worksheet.getCell("F1").fill = emeraldBackground;
      worksheet.getCell("F1").font = headingFont;

      worksheet.getCell("G1").fill = emeraldBackground;
      worksheet.getCell("G1").font = headingFont;

      worksheet.getCell("H1").fill = emeraldBackground;
      worksheet.getCell("H1").font = headingFont;

      let esgDetails = this.$store.getters.getEsgDetails;

      esgDetails.forEach((siteEsg) => {
        let orangeDetails = this.$store.getters.getOrangeDetails(siteEsg.id);

        worksheet.addRow({
          ...orangeDetails,
          ...siteEsg,
        });
      });

      // file writing
      let myDate = new Date();
      myDate = myDate.toISOString().split("T")[0];

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        saveAs(blob, `${myDate}__ESG.xlsx`);
      });
    },
    downloadDefects: async function () {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Defects");
      const assessment = workbook.addWorksheet("Quality Assessment");

      worksheet.columns = DEFECT_COLUMNS;
      assessment.columns = DEFECT_ASSESSMENT_COLUMNS;

      // add styles
      worksheet.getRow(1).alignment = { wrapText: true };
      assessment.getRow(1).alignment = { wrapText: true };

      let emeraldBackground = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "96c8a2" },
      };

      let headingFont = {
        size: 12,
      };

      assessment.getCell("A1").fill = emeraldBackground;
      assessment.getCell("A1").font = headingFont;

      assessment.getCell("B1").fill = emeraldBackground;
      assessment.getCell("B1").font = headingFont;

      assessment.getCell("C1").fill = emeraldBackground;
      assessment.getCell("C1").font = headingFont;

      worksheet.getCell("A1").fill = emeraldBackground;
      worksheet.getCell("A1").font = headingFont;

      worksheet.getCell("B1").fill = emeraldBackground;
      worksheet.getCell("B1").font = headingFont;

      worksheet.getCell("C1").fill = emeraldBackground;
      worksheet.getCell("C1").font = headingFont;

      worksheet.getCell("D1").fill = emeraldBackground;
      worksheet.getCell("D1").font = headingFont;

      worksheet.getCell("E1").fill = emeraldBackground;
      worksheet.getCell("E1").font = headingFont;

      worksheet.getCell("F1").fill = emeraldBackground;
      worksheet.getCell("F1").font = headingFont;

      worksheet.getCell("G1").fill = emeraldBackground;
      worksheet.getCell("G1").font = headingFont;

      worksheet.getCell("H1").fill = emeraldBackground;
      worksheet.getCell("H1").font = headingFont;

      worksheet.getCell("I1").fill = emeraldBackground;
      worksheet.getCell("I1").font = headingFont;

      worksheet.getCell("J1").fill = emeraldBackground;
      worksheet.getCell("J1").font = headingFont;

      worksheet.getCell("K1").fill = emeraldBackground;
      worksheet.getCell("K1").font = headingFont;

      worksheet.getCell("L1").fill = emeraldBackground;
      worksheet.getCell("L1").font = headingFont;

      worksheet.getCell("M1").fill = emeraldBackground;
      worksheet.getCell("M1").font = headingFont;

      worksheet.getCell("N1").fill = emeraldBackground;
      worksheet.getCell("N1").font = headingFont;

      worksheet.getCell("O1").fill = emeraldBackground;
      worksheet.getCell("O1").font = headingFont;

      this.$store.getters.getDefectsArrays.forEach((defect) => {
        let yellowDetails = this.$store.getters.getYellowDetails(defect.id);
        let orangeDetails = this.$store.getters.getOrangeDetails(defect.id);

        worksheet.addRow({
          ...orangeDetails,
          ...defect,
        });
      });

      this.$store.getters.getDefectAssessment.forEach((defect) => {
        assessment.addRow(defect);
      });

      // file writing
      let myDate = new Date();
      myDate = myDate.toISOString().split("T")[0];

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        saveAs(blob, `${myDate}__Defects.xlsx`);
      });
    },
    downloadStructures: async function () {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Structures");

      worksheet.columns = STRUCTURE_COLUMNS;

      // add styles
      worksheet.getRow(1).alignment = { wrapText: true };

      let emeraldBackground = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "96c8a2" },
      };

      let headingFont = {
        size: 12,
      };

      worksheet.getCell("A1").fill = emeraldBackground;
      worksheet.getCell("A1").font = headingFont;

      worksheet.getCell("B1").fill = emeraldBackground;
      worksheet.getCell("B1").font = headingFont;

      worksheet.getCell("C1").fill = emeraldBackground;
      worksheet.getCell("C1").font = headingFont;

      worksheet.getCell("D1").fill = emeraldBackground;
      worksheet.getCell("D1").font = headingFont;

      worksheet.getCell("E1").fill = emeraldBackground;
      worksheet.getCell("E1").font = headingFont;

      worksheet.getCell("F1").fill = emeraldBackground;
      worksheet.getCell("F1").font = headingFont;

      worksheet.getCell("G1").fill = emeraldBackground;
      worksheet.getCell("G1").font = headingFont;

      worksheet.getCell("H1").fill = emeraldBackground;
      worksheet.getCell("H1").font = headingFont;

      worksheet.getCell("I1").fill = emeraldBackground;
      worksheet.getCell("I1").font = headingFont;

      worksheet.getCell("J1").fill = emeraldBackground;
      worksheet.getCell("J1").font = headingFont;

      worksheet.getCell("K1").fill = emeraldBackground;
      worksheet.getCell("K1").font = headingFont;

      worksheet.getCell("L1").fill = emeraldBackground;
      worksheet.getCell("L1").font = headingFont;

      worksheet.getCell("M1").fill = emeraldBackground;
      worksheet.getCell("M1").font = headingFont;

      worksheet.getCell("N1").fill = emeraldBackground;
      worksheet.getCell("N1").font = headingFont;

      worksheet.getCell("O1").fill = emeraldBackground;
      worksheet.getCell("O1").font = headingFont;

      worksheet.getCell("P1").fill = emeraldBackground;
      worksheet.getCell("P1").font = headingFont;

      worksheet.getCell("Q1").fill = emeraldBackground;
      worksheet.getCell("Q1").font = headingFont;

      worksheet.getCell("R1").fill = emeraldBackground;
      worksheet.getCell("R1").font = headingFont;

      worksheet.getCell("S1").fill = emeraldBackground;
      worksheet.getCell("S1").font = headingFont;

      worksheet.getCell("T1").fill = emeraldBackground;
      worksheet.getCell("T1").font = headingFont;

      worksheet.getCell("U1").fill = emeraldBackground;
      worksheet.getCell("U1").font = headingFont;

      worksheet.getCell("V1").fill = emeraldBackground;
      worksheet.getCell("V1").font = headingFont;

      worksheet.getCell("W1").fill = emeraldBackground;
      worksheet.getCell("W1").font = headingFont;

      worksheet.getCell("X1").fill = emeraldBackground;
      worksheet.getCell("X1").font = headingFont;

      this.$store.getters.getEquipmentArrays.forEach((structureDetails) => {
        let yellowDetails = this.$store.getters.getYellowDetails(
          structureDetails.id
        );
        let orangeDetails = this.$store.getters.getOrangeDetails(
          structureDetails.id
        );

        worksheet.addRow({
          ...yellowDetails,
          ...orangeDetails,
          ...structureDetails,
        });
      });

      // file writing
      let myDate = new Date();
      myDate = myDate.toISOString().split("T")[0];

      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        saveAs(blob, `${myDate}__Structures.xlsx`);
      });
    },
  },
};
</script>
