# -*- coding: utf-8 -*-


import sys
import os
import json
from PyQt5.QtWidgets import QVBoxLayout, QMainWindow, QApplication, QProgressBar, QComboBox, QWidget, QHBoxLayout, QFrame, QLabel, QPushButton
from PyQt5.QtCore import QRect, QCoreApplication, QMetaObject, QPointF, Qt
from PyQt5.QtGui import QPixmap, QPainter, QPen, QColor, QBrush
from PyQt5.QtWidgets import QFileDialog



class LineAnnotationTool(QMainWindow):

    def __init__(self):
        super(LineAnnotationTool, self).__init__()
        self.image_files = []
        self.current_image_index = -1
        self.current_line_index = 0
        self.json_data = None
        self.lineAnnotations = {}
        self.initUI(self)

    def initUI(self, MainWindow):
        MainWindow.setObjectName("LineAnnotationTool")
        MainWindow.resize(int(1015 * SCALE_FACTOR), int(596 * SCALE_FACTOR))

        self.centralwidget = QWidget(self)
        self.centralwidget.setObjectName("centralwidget")
        
        self.horizontalLayout = QHBoxLayout(self.centralwidget)
        self.horizontalLayout.setObjectName("horizontalLayout")
        
        self.frame = QFrame(self.centralwidget)
        self.frame.setEnabled(True)
        self.frame.setFrameShape(QFrame.StyledPanel)
        self.frame.setFrameShadow(QFrame.Raised)
        self.frame.setObjectName("frame")
        
        self.verticalLayout = QVBoxLayout(self.frame)
        self.verticalLayout.setObjectName("verticalLayout")
        
        self.frame_5 = QFrame(self.frame)
        self.frame_5.setFrameShape(QFrame.StyledPanel)
        self.frame_5.setFrameShadow(QFrame.Raised)
        self.frame_5.setObjectName("frame_5")

        self.folderPath = QLabel(self.frame_5)
        self.folderPath.setGeometry(scaleRect(QRect(30, 20, 151, 41)))
        self.folderPath.setObjectName("folderPath")
        self.filePath = QLabel(self.frame_5)
        self.filePath.setGeometry(scaleRect(QRect(30, 70, 151, 41)))
        self.filePath.setObjectName("filePath")
        
        self.selectFolder = QPushButton(self.frame_5)
        self.selectFolder.setGeometry(scaleRect(QRect(210, 20, 121, 41)))
        self.selectFolder.setObjectName("selectFolder")
        
        self.selectFile = QPushButton(self.frame_5)
        self.selectFile.setGeometry(scaleRect(QRect(210, 70, 121, 41)))
        self.selectFile.setObjectName("selectFile")
        
        self.loadImage = QPushButton(self.frame_5)
        self.loadImage.setGeometry(scaleRect(QRect(80, 130, 111, 41)))
        self.loadImage.setObjectName("loadImage")
        
        self.loadLine = QPushButton(self.frame_5)
        self.loadLine.setGeometry(scaleRect(QRect(280, 130, 121, 41)))
        self.loadLine.setObjectName("loadLine")
        
        self.verticalLayout.addWidget(self.frame_5)
        self.frame_6 = QFrame(self.frame)
        self.frame_6.setFrameShape(QFrame.StyledPanel)
        self.frame_6.setFrameShadow(QFrame.Raised)
        self.frame_6.setObjectName("frame_6")
        
        self.lineAnnotation = QLabel(self.frame_6)
        self.lineAnnotation.setGeometry(scaleRect(QRect(45, 50, 120, 31)))
        self.lineAnnotation.setObjectName("lineAnnotation")
        
        self.lineAnndropDown = QComboBox(self.frame_6)
        self.lineAnndropDown.setGeometry(scaleRect(QRect(15, 110, 170, 31)))
        self.lineAnndropDown.setEditable(True)
        self.lineAnndropDown.setObjectName("lineAnndropDown")
            # Add the new labels
        self.lineAnndropDown.addItem("Horizontal Upper Edge (HUE)") # Ceilings and Roofs
        self.lineAnndropDown.addItem("Wall Edge (WE)") # Any edge (vertical or horizontal) found on walls
        self.lineAnndropDown.addItem("Horizontal Lower Edge (HLE)") # Floors and Foundation Edges
        self.lineAnndropDown.addItem("Door Edge (DE)") # Edges around doors, both interior and exterior
        self.lineAnndropDown.addItem("Window Edge (WndE)") # : Edges around windows
        self.lineAnndropDown.addItem("Miscellaneous Objects (MO)") # Any object or covered by the above categories
        lineEdit = self.lineAnndropDown.lineEdit()
        if lineEdit:  # Ensure the QComboBox has a line edit (it should in editable mode)
            lineEdit.setReadOnly(True)  # Make line edit read-only
            lineEdit.setAlignment(Qt.AlignCenter)
            lineEdit.setPlaceholderText("Select Line Annotation Label")
        
        self.imageAnnotation = QLabel(self.frame_6)
        self.imageAnnotation.setGeometry(scaleRect(QRect(250, 50, 180, 31)))
        self.imageAnnotation.setObjectName("imageAnnotation")
        
        self.imageAnndropDown = QComboBox(self.frame_6)
        self.imageAnndropDown.setGeometry(scaleRect(QRect(250, 110, 160, 31)))
        self.imageAnndropDown.setEditable(True)
        self.imageAnndropDown.setObjectName("imageAnndropDown")
    
        self.imageAnndropDown.addItem("Interior Environment (IE)")
        self.imageAnndropDown.addItem("Exterior Environment (EE)")
        lineEdit = self.imageAnndropDown.lineEdit()
        if lineEdit:  # Ensure the QComboBox has a line edit (it should in editable mode)
            lineEdit.setReadOnly(True)  # Make line edit read-only
            lineEdit.setAlignment(Qt.AlignCenter)
            lineEdit.setPlaceholderText("Select Image Class")

        
        self.verticalLayout.addWidget(self.frame_6)
        self.frame_7 = QFrame(self.frame)
        self.frame_7.setFrameShape(QFrame.StyledPanel)
        self.frame_7.setFrameShadow(QFrame.Raised)
        self.frame_7.setObjectName("frame_7")
        
        self.progressBarLine = QProgressBar(self.frame_7)
        self.progressBarLine.setGeometry(scaleRect(QRect(10, 60, 321, 31)))
        self.progressBarLine.setProperty("value", 0)
        self.progressBarLine.setObjectName("progressBarLine")
        
        self.Save = QPushButton(self.frame_7)
        self.Save.setGeometry(scaleRect(QRect(360, 120, 101, 51)))
        self.Save.setObjectName("Save")
        
        self.progressBarImage = QProgressBar(self.frame_7)
        self.progressBarImage.setGeometry(scaleRect(QRect(10, 140, 321, 31)))
        self.progressBarImage.setProperty("value", 0)
        self.progressBarImage.setObjectName("progressBarImage")
        
        self.progLine = QLabel(self.frame_7)
        self.progLine.setGeometry(scaleRect(QRect(80, 30, 191, 16)))
        self.progLine.setObjectName("progLine")
        
        self.progImage = QLabel(self.frame_7)
        self.progImage.setGeometry(scaleRect(QRect(80, 120, 191, 12)))
        self.progImage.setObjectName("progImage")
        
        self.verticalLayout.addWidget(self.frame_7)
        self.horizontalLayout.addWidget(self.frame)
        self.frame_2 = QFrame(self.centralwidget)
        self.frame_2.setFrameShape(QFrame.StyledPanel)
        self.frame_2.setFrameShadow(QFrame.Raised)
        self.frame_2.setObjectName("frame_2")
        self.frame_3 = QFrame(self.frame_2)
        self.frame_3.setGeometry(scaleRect(QRect(-1, -1, 471, 51)))
        self.frame_3.setFrameShape(QFrame.StyledPanel)
        self.frame_3.setFrameShadow(QFrame.Raised)
        self.frame_3.setObjectName("frame_3")
        
        self.imageName = QLabel(self.frame_3)
        self.imageName.setGeometry(scaleRect(QRect(109, 10, 211, 31)))
        self.imageName.setObjectName("imageName")
        
        self.frame_4 = QFrame(self.frame_2)
        self.frame_4.setGeometry(scaleRect(QRect(0, 50, 491, 520)))
        self.frame_4.setFrameShape(QFrame.StyledPanel)
        self.frame_4.setFrameShadow(QFrame.Raised)
        self.frame_4.setObjectName("frame_4")
        
        self.imageViewer = QLabel(self.frame_4)
        self.imageViewer.setGeometry(scaleRect(QRect(0, 0, 500, 400)))
        self.imageViewer.setObjectName("imageViewer")
        
        self.previousLine = QPushButton(self.frame_4)
        self.previousLine.setGeometry(scaleRect(QRect(100, 420, 91, 31)))
        self.previousLine.setObjectName("previousLine")
        
        self.nextLine = QPushButton(self.frame_4)
        self.nextLine.setGeometry(scaleRect(QRect(330, 420, 91, 31)))
        self.nextLine.setObjectName("nextLine")
        
        self.PreviousImage = QPushButton(self.frame_4)
        self.PreviousImage.setGeometry(scaleRect(QRect(100, 480, 91, 31)))
        self.PreviousImage.setObjectName("PreviousImage")
        
        self.nextImage = QPushButton(self.frame_4)
        self.nextImage.setGeometry(scaleRect(QRect(330, 480, 91, 31)))
        self.nextImage.setObjectName("nextImage")
        
        self.buttonsforLine = QLabel(self.frame_4)
        self.buttonsforLine.setGeometry(scaleRect(QRect(220, 400, 101, 31)))
        self.buttonsforLine.setObjectName("buttonsforLine")
        
        self.buttonsforImage = QLabel(self.frame_4)
        self.buttonsforImage.setGeometry(scaleRect(QRect(220, 460, 104, 20)))
        self.buttonsforImage.setObjectName("buttonsforImage")
        
        self.horizontalLayout.addWidget(self.frame_2)
        self.setCentralWidget(self.centralwidget)

        # Connect the functionality
        self.selectFolder.setObjectName("selectFolder")
        self.selectFolder.clicked.connect(self.select_folder)

        self.loadImage.setObjectName("loadImage")
        self.loadImage.clicked.connect(self.load_image)

        self.nextImage.setObjectName("nextImage")
        self.nextImage.clicked.connect(self.next_image)

        self.PreviousImage.setObjectName("PreviousImage")
        self.PreviousImage.clicked.connect(self.previous_image)

        self.selectFile.setObjectName("selectFile")
        self.selectFile.clicked.connect(self.select_file)

        self.loadLine.setObjectName("loadLine")
        self.loadLine.clicked.connect(self.load_line)

        self.nextLine.clicked.connect(self.next_line)
        self.previousLine.clicked.connect(self.previous_line)

        self.lineAnndropDown.activated.connect(self.save_annotation)
        self.lineAnndropDown.currentIndexChanged.connect(self.onAnnotationSelected)

        self.retranslateUi(MainWindow)
        QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, LineAnnotationTool):
        _translate = QCoreApplication.translate
        LineAnnotationTool.setWindowTitle(_translate("LineAnnotationTool", "Line Annotation Tool"))
        self.folderPath.setText(_translate("LineAnnotationTool", "No Folder Selected"))
        self.filePath.setText(_translate("LineAnnotationTool", "No File Selected"))
        self.selectFolder.setText(_translate("LineAnnotationTool", "Select a Folder"))
        self.selectFile.setText(_translate("LineAnnotationTool", "Select the JSON File"))
        self.loadImage.setText(_translate("LineAnnotationTool", "Load Image"))
        self.loadLine.setText(_translate("LineAnnotationTool", "Load Line"))
        self.lineAnnotation.setText(_translate("LineAnnotationTool", "<html><head/><body><p><span style=\" font-size:12pt; font-weight:600;\">Edge Annotation </span></p></body></html>"))
        self.lineAnndropDown.setCurrentText(_translate("LineAnnotationTool", "Select Edge Label"))
        self.imageAnnotation.setText(_translate("LineAnnotationTool", "<html><head/><body><p><span style=\" font-size:12pt; font-weight:600;\">Environment Annotation</span></p></body></html>"))
        self.imageAnndropDown.setCurrentText(_translate("LineAnnotationTool", "Select Environment Label"))
        self.Save.setText(_translate("LineAnnotationTool", "Save"))
        self.progLine.setText(_translate("LineAnnotationTool", "Progress Bar For Line In the Image"))
        self.progImage.setText(_translate("LineAnnotationTool", "Progress Bar for the Image in the Path"))
        self.imageName.setText(_translate("LineAnnotationTool", "<html><head/><body><p align=\"center\"><span style=\" font-size:10pt; font-weight:600;\">Image Name</span></p></body></html>"))
        self.imageViewer.setText(_translate("LineAnnotationTool", "<html><head/><body><p align=\"center\"><span style=\" font-size:10pt; font-weight:600;\">No Image Loaded </span></p></body></html>"))
        self.previousLine.setText(_translate("LineAnnotationTool", "Previous"))
        self.nextLine.setText(_translate("LineAnnotationTool", "Next"))
        self.PreviousImage.setText(_translate("LineAnnotationTool", "Previous"))
        self.nextImage.setText(_translate("LineAnnotationTool", "Next"))
        self.buttonsforLine.setText(_translate("LineAnnotationTool", "<html><head/><body><p align=\"center\"><span style=\" font-size:10pt; font-weight:600;\">Button For Line </span></p></body></html>"))
        self.buttonsforImage.setText(_translate("LineAnnotationTool", "<html><head/><body><p align=\"center\"><span style=\" font-size:10pt; font-weight:600;\">Button for Image</span></p></body></html>"))

    def _get_image_data(self, image_name):
        if not hasattr(self, 'json_data') or not self.json_data:
            raise Exception("JSON data not loaded!")
        
        image_data = [entry for entry in self.json_data if entry['filename'] == image_name]
        if not image_data:
            raise Exception("Image data not found in JSON!")
        
        return image_data[0]
    
    def select_folder(self):
        folder_name = QFileDialog.getExistingDirectory(self, "Select a Folder")
        if folder_name:
            self.folderPath.setText(folder_name)
            self.filePath.setText("No File Selected")

    def load_image(self):
        self.nextLine.setEnabled(False)
        self.previousLine.setEnabled(False)
        folder_name = self.folderPath.text()
        self.annotation_colors = {
            "Horizontal Upper Edge (HUE)": QColor(255, 0, 0),  # Red  # Ceilings and Roofs
            "Wall Edge (WE)": QColor(0, 255, 0),  # Green # Any edge (vertical or horizontal) found on walls
            "Horizontal Lower Edge (HLE)": QColor(0, 0, 255),  # Blue # Floors and Foundation Edges
            "Door Edge (DE)": QColor(255, 255, 0),  # Yellow  # Edges around doors, both interior and exterior
            "Window Edge (WndE)": QColor(255, 0, 255),  # Magenta  # Edges around windows
            "Miscellaneous Objects (MO)": QColor(0, 255, 255)   # Cyan # Any object or covered by the above categories
        }

        
        if folder_name not in ["", "No Folder Selected"]:
            # Getting a list of all the image files in the selected folder
            try:
                self.image_files = [f for f in os.listdir(folder_name) if f.endswith(('png', 'jpg', 'jpeg', 'bmp', 'xpm'))]
                #print(f"Detected images: {self.image_files}")
                if self.image_files:
                    self.current_image_index = 0
                    self.show_image(self.current_image_index)
                    self.progressBarImage.setMaximum(len(self.image_files))
                    self.imageProgressBar()
                else:
                    self.imageViewer.setText("No image files in the selected folder!")
                for image in self.image_files:
                    if image not in self.lineAnnotations:
                        image_data = self._get_image_data(image)
                        num_lines = len(image_data['edges_positive'])
                        self.lineAnnotations[image] = ["Not Annotated"] * num_lines
            except Exception as err:
                self.imageViewer.setText(f"Error: {err}")
                print(f"Error: {err}")
        else:
            self.imageViewer.setText("Please select a folder first!")
    
    def onAnnotationSelected(self):  
        if self.lineAnndropDown.currentText():
            self.nextLine.setEnabled(True)

    def save_annotation(self):
        current_image_name = self.imageName.text()  # current image name
        selected_annotation = self.lineAnndropDown.currentText()
        image_data = self._get_image_data(current_image_name)

        if image_data:
            line_count = len(image_data['edges_positive'])
        else:
            return print("Error: Image data not found in JSON!")
        
        if selected_annotation:
            if current_image_name not in self.lineAnnotations:
                self.lineAnnotations[current_image_name] = []

            if len(self.lineAnnotations[current_image_name]) < line_count:
                self.lineAnnotations[current_image_name].append(selected_annotation)
            else:
                # Overwrite the annotation for the current line
                self.lineAnnotations[current_image_name][self.current_line_index] = selected_annotation

            self.load_line()
            self.nextLine.setEnabled(True)
        
        #if selected_annotation and current_image_name in self.lineAnnotations:
         #    if len(self.lineAnnotations[current_image_name]) < line_count:
          #      self.lineAnnotations[current_image_name].append(selected_annotation)
           #     self.load_line()
            #    self.nextLine.setEnabled(True)  # Enable the next line button after saving annotation
        #else:
            # If we've reached the maximum number of annotations for this image
         #   self.nextLine.setEnabled(False)

    def check_annotation_completeness(self): ## error handling
        # Get the current image name
        current_image_name = self.imageName.text()

        # Get the number of annotations for the current image
        annotations = self.lineAnnotations.get(current_image_name, [])
        annotation_count = len(annotations)

        # Fetch the line data for the current image from the JSON data
        image_data = self._get_image_data(current_image_name)

        if image_data:
            line_count = len(image_data['edges_positive'])
       
        # Compare the annotation count with the line count
        if annotation_count == line_count:
            print("Annotations are complete for the current image.")
            print(f"Done: Annotation success! {annotation_count} annotations found for {line_count} lines.")
            print("List of annotations for the current image:", annotations)
        else:
            print(f"Error: Annotations mismatch! {annotation_count} annotations found for {line_count} lines.")



    def show_image(self, index):
        if 0 <= index < len(self.image_files):
            folder_name = self.folderPath.text()
            image_path = os.path.join(folder_name, self.image_files[index])
            #print(f"Loading image from: {image_path}")
            pixmap = QPixmap(image_path)
            self.imageViewer.setPixmap(pixmap.scaled(self.imageViewer.width(), self.imageViewer.height()))
            self.imageName.setText(self.image_files[index])
        else:
            self.imageViewer.setText("No image to display!")

    def next_image(self):
        #self.check_annotation_completeness() # call error handling 
        self.lineAnnotations[self.imageName.text()] = []
        #Load the next image in the directory
        if self.current_image_index < len(self.image_files) - 1:
            self.current_image_index += 1
            self.current_line_index = 0
            self.load_line()
            self.show_image(self.current_image_index)
            self.imageProgressBar()
        else:
            self.imageViewer.setText("This is the last image!")
        
        self.nextLine.setEnabled(False)
        self.previousLine.setEnabled(False)

    def previous_image(self):
        #self.lineAnnotations[self.imageName.text()] = []
        #Load the previous image in the directory
        if self.current_image_index > 0:
            self.current_image_index -= 1
            self.current_line_index = 0
            self.load_line()
            self.show_image(self.current_image_index)
            self.imageProgressBar()
        else:
            self.imageViewer.setText("This is the first image!")
        
        self.nextLine.setEnabled(False)
        self.previousLine.setEnabled(False)

    def imageProgressBar(self):
        self.progressBarImage.setValue(self.current_image_index + 1)
        self.progImage.setText(f"{self.current_image_index + 1} of {len(self.image_files)} images annotated")

    def select_file(self):
        options = QFileDialog.Options()
        file_name, _ = QFileDialog.getOpenFileName(self, "Select the JSON File", "", "JSON Files (*.json);;All Files (*)", options=options)
        if file_name:
            self.filePath.setText(file_name)
            self.json_data = self.load_json(file_name)
        else:
            self.filePath.setText("File not Selected")
    
    def load_json(self, file_name):
        with open(file_name, 'r') as file:
            data = json.load(file)
        return data
    
    def load_line(self):
        # This method will extract the required info for the current image and draw the lines.
        current_image_name = self.image_files[self.current_image_index]
       
        image_data = self._get_image_data(current_image_name)
        if not image_data:
            return self.filePath.setText("File not Selected")

        junctions = image_data['junctions']
        edges = image_data['edges_positive']

        # Draw lines on the current image
        folder_name = self.folderPath.text()
        image_path = os.path.join(folder_name, current_image_name)
        pixmap = QPixmap(image_path)
        painter = QPainter(pixmap)

        if current_image_name not in self.lineAnnotations:
            self.lineAnnotations[current_image_name] = [None] * len(edges)

        for i in range(self.current_line_index + 1):
            edge = edges[i]
            # Determine color based on annotation
            current_annotation = self.lineAnnotations[current_image_name][i] if i < len(self.lineAnnotations[current_image_name]) else "Not Annotated"
            line_color = self.annotation_colors.get(current_annotation, QColor(255, 165, 0))  # Default color if annotation not found

            # Set the color for the line
            pen = QPen(line_color)
            pen.setWidth(2)
            painter.setPen(pen)

            # Draw the specific line
            start_point, end_point = junctions[edge[0]], junctions[edge[1]]
            p1 = QPointF(start_point[0], start_point[1])
            p2 = QPointF(end_point[0], end_point[1])
            painter.drawLine(p1, p2)
            
        
        # Set the color for the junction points
        pen = QPen(QColor(52, 255, 236))  # RGB for blue color
        brush = QBrush(QColor(52, 255, 236)) 
        painter.setPen(pen)
        painter.setBrush(brush)
        radius = 2  # Set the radius for the circle

        junctions_to_draw = set()

        for index, edge in enumerate(edges):
            if index > self.current_line_index:
                break
            junctions_to_draw.add(edge[0])
            junctions_to_draw.add(edge[1])

    # Draw only the selected junction points
        for junction_index in junctions_to_draw:
            junction = junctions[junction_index]
            painter.drawEllipse(QPointF(junction[0], junction[1]), radius, radius)

        painter.end()

        # Display the image with the overlayed lines
        self.imageViewer.setPixmap(pixmap.scaled(self.imageViewer.width(), self.imageViewer.height()))
        self.lineProgressBar()
        self.nextLine.setEnabled(False)
        self.previousLine.setEnabled(True)
    
    def next_line(self):
       
        current_image_name = self.image_files[self.current_image_index]
        image_data = self._get_image_data(current_image_name)
        if self.current_line_index < len(image_data['edges_positive']) - 1:
            self.current_line_index += 1
                # Check if you're at the end of the lines for the current image
            if self.current_line_index == len(self.lineAnnotations[self.imageName.text()]):
                self.nextLine.setEnabled(False)
            else:
                # Update the dropdown to reflect the next line's annotation, if it exists
                self.lineAnndropDown.setCurrentText(self.lineAnnotations[self.imageName.text()][self.current_line_index])
            self.previousLine.setEnabled(True)

            self.lineAnndropDown.setCurrentText("Select Image Class")    
            self.load_line()
            self.lineProgressBar()
        #else: 
            #return 

    def previous_line(self):
        if not hasattr(self, 'json_data') or not self.json_data:
            return
        
        current_image_name = self.imageName.text()

        # Update annotations
        if current_image_name in self.lineAnnotations and self.lineAnnotations[current_image_name]:
            #self.lineAnnotations[current_image_name].pop()  # Remove the last annotation
            self.lineAnnotations[current_image_name][self.current_line_index] = "Not Annotated"
        # Move to the previous line
        if self.current_line_index >0:
            self.current_line_index -= 1
            self.lineAnndropDown.setCurrentText("Select Image Class")
            self.load_line()
            self.previousLine.setEnabled(self.current_line_index > 0)
        else:
            self.previousLine.setEnabled(False)
            
        # Disable the nextLine button since we've removed the last annotation
        self.nextLine.setEnabled(False)

        #self.load_line()
        self.lineProgressBar()

    def lineProgressBar(self):
        if not hasattr(self, 'json_data'):
            self.progressBarLine.setValue(0)
            return self.filePath.setText("File not Selected")

        current_image_name = self.image_files[self.current_image_index]
        image_data = [entry for entry in self.json_data if entry['filename'] == current_image_name]
        if not image_data:
            self.progressBarLine.setValue(0)
            return self.filePath.setText("File not Selected")
        
        # Set the progress bar's maximum value
        total_lines = len(image_data[0]['edges_positive'])
        self.progressBarLine.setMaximum(total_lines)
        
        # Update the progress bar's value
        self.progressBarLine.setValue(self.current_line_index + 1)
        self.progLine.setText(f"{self.current_line_index + 1} of {total_lines} lines annotated")
        


SCALE_FACTOR = 2
# Scaling function for QRect values
def scaleRect(rect):
    return QRect(int(rect.x() * SCALE_FACTOR),
                 int(rect.y() * SCALE_FACTOR),
                 int(rect.width() * SCALE_FACTOR),
                 int(rect.height() * SCALE_FACTOR))


if __name__ == "__main__":
    import sys
    app = QApplication(sys.argv)
    MainWindow  = LineAnnotationTool()
    MainWindow.show()
    sys.exit(app.exec_())
