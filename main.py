# -*- coding: utf-8 -*-


import sys
from PyQt5.QtWidgets import QVBoxLayout, QMainWindow, QApplication, QProgressBar, QComboBox, QWidget, QHBoxLayout, QFrame, QLabel, QPushButton
from PyQt5.QtCore import QRect, QCoreApplication, QMetaObject
from PyQt5.QtGui import QPixmap
from PyQt5.QtWidgets import QFileDialog


class LineAnnotationTool(QMainWindow):

    def __init__(self):
        super(LineAnnotationTool, self).__init__()
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
        self.lineAnnotation.setGeometry(scaleRect(QRect(50, 50, 111, 31)))
        self.lineAnnotation.setObjectName("lineAnnotation")
        
        self.lineAnndropDown = QComboBox(self.frame_6)
        self.lineAnndropDown.setGeometry(scaleRect(QRect(40, 110, 151, 31)))
        self.lineAnndropDown.setEditable(True)
        self.lineAnndropDown.setObjectName("lineAnndropDown")
        
        self.imageAnnotation = QLabel(self.frame_6)
        self.imageAnnotation.setGeometry(scaleRect(QRect(270, 50, 131, 31)))
        self.imageAnnotation.setObjectName("imageAnnotation")
        
        self.imageAnndropDown = QComboBox(self.frame_6)
        self.imageAnndropDown.setGeometry(scaleRect(QRect(260, 110, 151, 31)))
        self.imageAnndropDown.setEditable(True)
        self.imageAnndropDown.setObjectName("imageAnndropDown")
        
        self.verticalLayout.addWidget(self.frame_6)
        self.frame_7 = QFrame(self.frame)
        self.frame_7.setFrameShape(QFrame.StyledPanel)
        self.frame_7.setFrameShadow(QFrame.Raised)
        self.frame_7.setObjectName("frame_7")
        
        self.progressBarLine = QProgressBar(self.frame_7)
        self.progressBarLine.setGeometry(scaleRect(QRect(10, 60, 321, 31)))
        self.progressBarLine.setProperty("value", 24)
        self.progressBarLine.setObjectName("progressBarLine")
        
        self.Save = QPushButton(self.frame_7)
        self.Save.setGeometry(scaleRect(QRect(360, 120, 101, 51)))
        self.Save.setObjectName("Save")
        
        self.progressBarImage = QProgressBar(self.frame_7)
        self.progressBarImage.setGeometry(scaleRect(QRect(10, 140, 321, 31)))
        self.progressBarImage.setProperty("value", 24)
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
        self.frame_4.setGeometry(scaleRect(QRect(0, 50, 491, 501)))
        self.frame_4.setFrameShape(QFrame.StyledPanel)
        self.frame_4.setFrameShadow(QFrame.Raised)
        self.frame_4.setObjectName("frame_4")
        
        self.imageViewer = QLabel(self.frame_4)
        self.imageViewer.setGeometry(scaleRect(QRect(0, 0, 481, 361)))
        self.imageViewer.setObjectName("imageViewer")
        
        self.previousLine = QPushButton(self.frame_4)
        self.previousLine.setGeometry(scaleRect(QRect(100, 400, 91, 31)))
        self.previousLine.setObjectName("previousLine")
        
        self.nextLine = QPushButton(self.frame_4)
        self.nextLine.setGeometry(scaleRect(QRect(330, 400, 91, 31)))
        self.nextLine.setObjectName("nextLine")
        
        self.PreviousImage = QPushButton(self.frame_4)
        self.PreviousImage.setGeometry(scaleRect(QRect(100, 460, 91, 31)))
        self.PreviousImage.setObjectName("PreviousImage")
        
        self.nextImage = QPushButton(self.frame_4)
        self.nextImage.setGeometry(scaleRect(QRect(330, 460, 91, 31)))
        self.nextImage.setObjectName("nextImage")
        
        self.buttonsforLine = QLabel(self.frame_4)
        self.buttonsforLine.setGeometry(scaleRect(QRect(220, 370, 101, 31)))
        self.buttonsforLine.setObjectName("buttonsforLine")
        
        self.buttonsforImage = QLabel(self.frame_4)
        self.buttonsforImage.setGeometry(scaleRect(QRect(220, 440, 101, 20)))
        self.buttonsforImage.setObjectName("buttonsforImage")
        
        self.horizontalLayout.addWidget(self.frame_2)
        self.setCentralWidget(self.centralwidget)

        self.selectFile.setObjectName("selectFile")
        self.selectFile.clicked.connect(self.select_folder)

        self.loadImage.setObjectName("loadImage")
        self.loadImage.clicked.connect(self.load_image)


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
        self.lineAnnotation.setText(_translate("LineAnnotationTool", "<html><head/><body><p><span style=\" font-size:12pt; font-weight:600;\">Line Annotation </span></p></body></html>"))
        self.lineAnndropDown.setCurrentText(_translate("LineAnnotationTool", "Select Line Class"))
        self.imageAnnotation.setText(_translate("LineAnnotationTool", "<html><head/><body><p><span style=\" font-size:12pt; font-weight:600;\">Image Annotation</span></p></body></html>"))
        self.imageAnndropDown.setCurrentText(_translate("LineAnnotationTool", "Select Image Class"))
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

    def select_folder(self):
        folder_name = QFileDialog.getExistingDirectory(self, "Select a Folder")
        if folder_name:
            self.folderPath.setText(folder_name)
            # Set default file path as empty when a new folder is selected
            self.filePath.setText("No File Selected")

    def load_image(self):
        folder_name = self.folderPath.text()
        if folder_name not in ["", "No Folder Selected"]:
            # Getting a list of all the image files in the selected folder
            image_files = [f for f in os.listdir(folder_name) if f.endswith(('png', 'jpg', 'jpeg', 'bmp', 'xpm'))]
            if image_files:
                first_image_path = os.path.join(folder_name, image_files[0])
                pixmap = QPixmap(first_image_path)
                self.imageViewer.setPixmap(pixmap.scaled(self.imageViewer.width(), self.imageViewer.height()))
                self.imageName.setText(image_files[0])
            else:
                self.imageViewer.setText("No image files in the selected folder!")
        else:
            self.imageViewer.setText("Please select a folder first!")

SCALE_FACTOR = 1.5
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
