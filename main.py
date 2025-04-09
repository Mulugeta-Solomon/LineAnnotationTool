# -*- coding: utf-8 -*-
import sys
import os
import json

from PyQt5.QtCore import Qt, QPointF, pyqtSignal, QTimer
from PyQt5.QtGui import QPixmap, QPainter, QPen, QColor, QBrush, QPalette
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget,
    QPushButton, QLabel, QVBoxLayout, QHBoxLayout,
    QProgressBar, QFileDialog, QButtonGroup, QRadioButton, QGroupBox,
    QFrame, QSplitter, QFormLayout, QStyleFactory,
    QSpacerItem, QSizePolicy
)


###############################################################################
# 1. AnnotationLogic
###############################################################################
class AnnotationLogic:
    def __init__(self):
        self.json_data = []
        self.image_files = []
        self.current_image_index = -1
        self.current_line_index = 0
        # { filename: {"lineannotation": [...], "environment": None/"Indoor Environment"/"Outdoor Environment"} }
        self.annotations = {}
        self.image_data_cache = {}

        # Classes and their colors
        self.line_annotation_classes = [
            "Horizontal Upper Edge (HUE)",
            "Wall Edge (WE)",
            "Horizontal Lower Edge (HLE)",
            "Door Edge (DE)",
            "Window Edge (WndE)",
            "Miscellaneous Objects (MO)"
        ]

        # PyQt color objects (used in the viewer)
        self.annotation_colors = {
            "Horizontal Upper Edge (HUE)": QColor(255, 0, 0),
            "Wall Edge (WE)": QColor(0, 255, 0),
            "Horizontal Lower Edge (HLE)": QColor(0, 0, 255),
            "Door Edge (DE)": QColor(255, 255, 0),
            "Window Edge (WndE)": QColor(255, 0, 255),
            "Miscellaneous Objects (MO)": QColor(0, 255, 255)
        }

        # Hex color strings (used for radio-button stylesheets)
        self.annotation_colors_hex = {
            "Horizontal Upper Edge (HUE)": "#FF0000",
            "Wall Edge (WE)": "#00FF00",
            "Horizontal Lower Edge (HLE)": "#0000FF",
            "Door Edge (DE)": "#FFFF00",
            "Window Edge (WndE)": "#FF00FF",
            "Miscellaneous Objects (MO)": "#00FFFF"
        }

    def load_json_file(self, file_path):
        with open(file_path, 'r') as f:
            self.json_data = json.load(f)

    def _get_image_data(self, image_name):
        if image_name in self.image_data_cache:
            return self.image_data_cache[image_name]
        filtered = [entry for entry in self.json_data if entry['filename'] == image_name]
        if not filtered:
            raise ValueError(f"No JSON data found for image '{image_name}'.")
        self.image_data_cache[image_name] = filtered[0]
        return filtered[0]

    def initialize_annotations_for_folder(self, folder_path):
        if not folder_path or not os.path.isdir(folder_path):
            raise ValueError("Invalid folder selected.")

        valid_exts = ('.png', '.jpg', '.jpeg', '.bmp', '.xpm')
        self.image_files = [
            f for f in os.listdir(folder_path)
            if f.lower().endswith(valid_exts)
        ]
        self.image_files.sort()

        self.current_image_index = 0
        # Create placeholders for each image if not present
        for img in self.image_files:
            if img not in self.annotations:
                try:
                    img_data = self._get_image_data(img)
                    num_lines = len(img_data['edges_positive'])
                    self.annotations[img] = {
                        "lineannotation": [None]*num_lines,
                        "environment": None
                    }
                except ValueError:
                    pass

    def get_current_image_name(self):
        if 0 <= self.current_image_index < len(self.image_files):
            return self.image_files[self.current_image_index]
        return None

    def get_total_images(self):
        return len(self.image_files)

    def get_current_line_count(self):
        image_name = self.get_current_image_name()
        if not image_name:
            return 0
        image_data = self._get_image_data(image_name)
        return len(image_data['edges_positive'])

    def set_line_annotation(self, line_index, annotation_label):
        image_name = self.get_current_image_name()
        if image_name and line_index < self.get_current_line_count():
            self.annotations[image_name]["lineannotation"][line_index] = annotation_label

    def get_line_annotation(self, line_index):
        image_name = self.get_current_image_name()
        if image_name and line_index < self.get_current_line_count():
            return self.annotations[image_name]["lineannotation"][line_index]
        return None

    def set_image_environment(self, environment_label):
        image_name = self.get_current_image_name()
        if image_name:
            self.annotations[image_name]["environment"] = environment_label

    def get_image_environment(self):
        image_name = self.get_current_image_name()
        if image_name:
            return self.annotations[image_name]["environment"]
        return None

    def get_annotated_line_count(self):
        image_name = self.get_current_image_name()
        if not image_name:
            return 0
        line_ann = self.annotations[image_name]["lineannotation"]
        return sum(1 for ann in line_ann if ann is not None)

    def is_current_image_fully_annotated(self):
        image_name = self.get_current_image_name()
        if not image_name:
            return False
        line_ann = self.annotations[image_name]["lineannotation"]
        env_ann = self.annotations[image_name]["environment"]
        if None in line_ann:
            return False
        if env_ann is None:
            return False
        return True

    def next_image(self):
        """
        Returns True if we move to next image successfully,
        otherwise False if the current image is not fully annotated
        or if we are at the last image.
        """
        if not self.is_current_image_fully_annotated():
            return False
        if self.current_image_index < self.get_total_images() - 1:
            self.current_image_index += 1
            self.current_line_index = 0
            return True
        return False

    def previous_image(self):
        if self.current_image_index > 0:
            self.current_image_index -= 1
            self.current_line_index = 0
            return True
        return False

    def next_line(self):
        """
        Returns True if we successfully move to the next line,
        otherwise False if current line is unannotated.
        """
        if not self.get_line_annotation(self.current_line_index):
            return False
        total_lines = self.get_current_line_count()
        self.current_line_index = (self.current_line_index + 1) % total_lines
        return True

    def previous_line(self):
        """
        Returns True if we successfully move to the previous line,
        otherwise False if current line is unannotated.
        """
        if not self.get_line_annotation(self.current_line_index):
            return False
        total_lines = self.get_current_line_count()
        self.current_line_index = (self.current_line_index - 1) % total_lines
        return True

    def get_junctions_and_edges(self, image_name):
        data = self._get_image_data(image_name)
        return data['junctions'], data['edges_positive']

    def save_annotations(self, output_path="annotations_result.json"):
        with open(output_path, 'w') as fp:
            json.dump(self.annotations, fp, indent=4)


###############################################################################
# 2. ImageViewer
#    - Unannotated lines => dashed red with higher frequency => DotLine
#    - Only the current line shows 2 blue points at its endpoints
###############################################################################
class ImageViewer(QWidget):
    def __init__(self, logic: AnnotationLogic, parent=None):
        super().__init__(parent)
        self.logic = logic
        self._pixmap = QPixmap()

        # Increase the default size to favor the image viewer more
        self.setMinimumSize(700, 500)

    def set_pixmap(self, pixmap: QPixmap):
        self._pixmap = pixmap
        self.update()

    def paintEvent(self, event):
        super().paintEvent(event)
        painter = QPainter(self)
        if not self._pixmap.isNull():
            # Draw image scaled
            scaled = self._pixmap.scaled(
                self.size(), Qt.KeepAspectRatio, Qt.SmoothTransformation
            )
            x = (self.width() - scaled.width()) // 2
            y = (self.height() - scaled.height()) // 2
            painter.drawPixmap(x, y, scaled)

            # Then overlay lines
            self.draw_lines(painter, scaled, x, y)
        else:
            painter.drawText(self.rect(), Qt.AlignCenter, "No Image Loaded")

    def draw_lines(self, painter, scaled_pixmap, offset_x, offset_y):
        image_name = self.logic.get_current_image_name()
        if not image_name or self._pixmap.isNull():
            return

        try:
            junctions, edges = self.logic.get_junctions_and_edges(image_name)
        except ValueError:
            return

        orig_w = self._pixmap.width()
        orig_h = self._pixmap.height()
        scaled_w = scaled_pixmap.width()
        scaled_h = scaled_pixmap.height()

        def scale_point(pt):
            px = (pt[0] / orig_w) * scaled_w
            py = (pt[1] / orig_h) * scaled_h
            return QPointF(offset_x + px, offset_y + py)

        painter.setRenderHint(QPainter.Antialiasing, True)
        current_line = self.logic.current_line_index

        for idx, (start_idx, end_idx) in enumerate(edges):
            line_annot = self.logic.get_line_annotation(idx)

            if line_annot is None:
                # Unannotated => dashed red with higher frequency => DotLine
                pen = QPen(QColor(255, 0, 0), 2, Qt.DotLine)
            else:
                # Annotated => color from the dictionary, solid
                color = self.logic.annotation_colors.get(line_annot, QColor(128, 128, 128))
                width = 3 if idx == current_line else 2
                pen = QPen(color, width, Qt.SolidLine)

            painter.setPen(pen)
            p1 = scale_point(junctions[start_idx])
            p2 = scale_point(junctions[end_idx])
            painter.drawLine(p1, p2)

        # Draw the two BLUE junction points only for the current line
        if current_line < len(edges):
            start_idx, end_idx = edges[current_line]
            p1 = scale_point(junctions[start_idx])
            p2 = scale_point(junctions[end_idx])

            painter.setPen(QPen(QColor(0, 0, 255), 2, Qt.SolidLine))
            painter.setBrush(QBrush(QColor(0, 0, 255), Qt.SolidPattern))
            radius = 5
            painter.drawEllipse(p1, radius, radius)
            painter.drawEllipse(p2, radius, radius)


###############################################################################
# 3. LineAnnotationPanel 
#    - Color-coded radio buttons with a thin border, filled on press
###############################################################################
class LineAnnotationPanel(QWidget):
    lineAnnotationChanged = pyqtSignal()

    def __init__(self, logic: AnnotationLogic, parent=None):
        super().__init__(parent)
        self.logic = logic

        layout = QVBoxLayout()
        self.setLayout(layout)

        line_box = QGroupBox("Line Annotation")
        line_layout = QVBoxLayout()
        line_box.setLayout(line_layout)

        self.line_button_group = QButtonGroup(self)
        self.line_button_group.setExclusive(True)

        # Create a radio button for each class, with dynamic color-coded style
        for cls in self.logic.line_annotation_classes:
            rb = QRadioButton(cls)

            # Get the color in hex form
            color_hex = self.logic.annotation_colors_hex[cls]
            # Style: thin border in that color, then fill if checked
            # Hide the default radio indicator (the circle) by setting width=0
            style = f"""
            QRadioButton {{
                border: 2px solid {color_hex};
                border-radius: 6px;
                padding: 6px;
                margin: 3px;
                color: #333;
            }}
            QRadioButton::indicator {{
                width: 0px;
            }}
            QRadioButton:checked {{
                background-color: {color_hex};
                color: #FFFFFF;
            }}
            """
            rb.setStyleSheet(style)
            line_layout.addWidget(rb)
            self.line_button_group.addButton(rb)

        # Connect
        self.line_button_group.buttonClicked.connect(self.on_line_annotation_selected)

        layout.addWidget(line_box)
        layout.addSpacerItem(QSpacerItem(
            20, 40, QSizePolicy.Minimum, QSizePolicy.Expanding
        ))

    def on_line_annotation_selected(self, button):
        annotation_label = button.text()
        line_idx = self.logic.current_line_index
        self.logic.set_line_annotation(line_idx, annotation_label)
        # Emit signal => immediate redraw
        self.lineAnnotationChanged.emit()

    def update_selections(self):
        current_annot = self.logic.get_line_annotation(self.logic.current_line_index)
        # Uncheck everything first
        for btn in self.line_button_group.buttons():
            btn.setChecked(False)

        # Check the one that matches
        if current_annot:
            for btn in self.line_button_group.buttons():
                if btn.text() == current_annot:
                    btn.setChecked(True)
                    break


###############################################################################
# 4. MainWindow
###############################################################################
class LineAnnotationTool(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Line Annotation Tool - Modern UI")

        # Default bigger window
        self.resize(1400, 900)

        # Instead of a status bar, use a custom label for ephemeral alerts
        self.alert_label = QLabel("")
        self.alert_label.setVisible(False)  # hidden by default
        self.alert_label.setStyleSheet("""
            background-color: #F44336;
            color: #FFFFFF;
            border-radius: 6px;
            padding: 6px 10px;
            font-weight: bold;
        """)
        # We'll place this at the bottom of the layout (centered)

        QApplication.setStyle(QStyleFactory.create("Fusion"))

        palette = QPalette()
        palette.setColor(QPalette.Window, QColor(245, 245, 245))
        palette.setColor(QPalette.WindowText, Qt.black)
        palette.setColor(QPalette.Base, QColor(255, 255, 255))
        palette.setColor(QPalette.Button, QColor(230, 230, 230))
        palette.setColor(QPalette.ButtonText, Qt.black)
        palette.setColor(QPalette.Highlight, QColor(76, 163, 224))
        palette.setColor(QPalette.HighlightedText, Qt.white)
        self.setPalette(palette)

        self.setStyleSheet("""
            QGroupBox {
                font-weight: bold;
                border: 1px solid #AAAAAA;
                border-radius: 5px;
                margin-top: 10px;
            }
            QGroupBox:title {
                subcontrol-origin: margin;
                left: 15px;
                padding: 0 3px 0 3px;
            }
            QPushButton {
                background-color: #4CAF50;
                color: white;
                border-radius: 5px;
                padding: 6px 10px;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
            QProgressBar {
                height: 14px;
                border-radius: 7px;
                text-align: center;
            }
            QProgressBar::chunk {
                background-color: #2196F3;
                border-radius: 7px;
            }
            QLabel {
                font-size: 12px;
            }
        """)

        self.logic = AnnotationLogic()

        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # We'll use a vertical layout so we can place the alert label at the bottom
        main_vlayout = QVBoxLayout()
        central_widget.setLayout(main_vlayout)

        # The top area is a horizontal layout with the QSplitter
        top_layout = QHBoxLayout()
        main_vlayout.addLayout(top_layout, stretch=1)

        splitter = QSplitter(Qt.Horizontal)
        top_layout.addWidget(splitter)

        # Left Panel
        left_panel = QWidget()
        left_layout = QVBoxLayout()
        left_panel.setLayout(left_layout)
        splitter.addWidget(left_panel)

        # File selection group
        file_group = QGroupBox("File Selection")
        file_form = QFormLayout()
        file_group.setLayout(file_form)

        self.folder_label = QLabel("No Folder Selected")
        self.select_folder_btn = QPushButton("Select Folder")

        self.file_label = QLabel("No JSON Selected")
        self.select_file_btn = QPushButton("Select JSON")

        file_form.addRow(self.folder_label, self.select_folder_btn)
        file_form.addRow(self.file_label, self.select_file_btn)

        # Load images/lines row
        load_layout = QHBoxLayout()
        self.load_images_btn = QPushButton("Load Images")
        self.load_lines_btn = QPushButton("Load Lines")
        load_layout.addWidget(self.load_images_btn)
        load_layout.addWidget(self.load_lines_btn)
        file_form.addRow(load_layout)

        left_layout.addWidget(file_group)

        # Progress group
        progress_group = QGroupBox("Progress")
        progress_layout = QVBoxLayout()
        progress_group.setLayout(progress_layout)

        self.image_progress_label = QLabel("Image Progress: 0/0")
        self.image_progress = QProgressBar()
        self.line_progress_label = QLabel("Line Progress: 0/0")
        self.line_progress = QProgressBar()

        progress_layout.addWidget(self.image_progress_label)
        progress_layout.addWidget(self.image_progress)
        progress_layout.addWidget(self.line_progress_label)
        progress_layout.addWidget(self.line_progress)

        left_layout.addWidget(progress_group)

        # Environment Toggle Group
        env_group = QGroupBox("Environment")
        env_layout = QVBoxLayout()
        env_group.setLayout(env_layout)
        self.env_toggle = QPushButton("🏠 Indoor Environment")
        self.env_toggle.setCheckable(True)
        self.env_toggle.setChecked(False)  # default => Indoor
        # Beige style:
        self.env_toggle.setStyleSheet("QPushButton { background-color: #F5F5DC; color: black; }")
        env_layout.addWidget(self.env_toggle)
        left_layout.addWidget(env_group)

        # The line annotation panel
        self.line_panel = LineAnnotationPanel(self.logic)
        left_layout.addWidget(self.line_panel)

        # Save button
        self.save_btn = QPushButton("Save Annotations")
        left_layout.addWidget(self.save_btn)

        # Right Panel for image and nav
        right_panel = QWidget()
        right_layout = QVBoxLayout()
        right_panel.setLayout(right_layout)
        splitter.addWidget(right_panel)

        # SMALL label for the image name, so the viewer is bigger
        self.image_name_label = QLabel("No Image Loaded")
        self.image_name_label.setAlignment(Qt.AlignCenter)
        # Decrease the height to make the image area bigger
        self.image_name_label.setFixedHeight(30)

        # The image viewer
        self.image_viewer = ImageViewer(self.logic)
        right_layout.addWidget(self.image_viewer, stretch=1)
        right_layout.addWidget(self.image_name_label, stretch=0)

        # Line nav
        line_nav_layout = QHBoxLayout()
        self.prev_line_btn = QPushButton("Prev Line")
        self.next_line_btn = QPushButton("Next Line")
        line_nav_layout.addWidget(self.prev_line_btn)
        line_nav_layout.addWidget(self.next_line_btn)
        right_layout.addLayout(line_nav_layout)

        # Image nav
        image_nav_layout = QHBoxLayout()
        self.prev_image_btn = QPushButton("Prev Image")
        self.next_image_btn = QPushButton("Next Image")
        image_nav_layout.addWidget(self.prev_image_btn)
        image_nav_layout.addWidget(self.next_image_btn)
        right_layout.addLayout(image_nav_layout)

        # Finally, add the alert_label at the bottom, centered
        alert_layout = QHBoxLayout()
        alert_layout.addStretch(1)
        alert_layout.addWidget(self.alert_label)
        alert_layout.addStretch(1)
        main_vlayout.addLayout(alert_layout, stretch=0)

        # Connect signals
        self.select_folder_btn.clicked.connect(self.select_folder)
        self.select_file_btn.clicked.connect(self.select_json)

        self.load_images_btn.clicked.connect(self.load_images)
        self.load_lines_btn.clicked.connect(self.load_lines)

        self.prev_line_btn.clicked.connect(self.prev_line)
        self.next_line_btn.clicked.connect(self.next_line)
        self.prev_image_btn.clicked.connect(self.prev_image)
        self.next_image_btn.clicked.connect(self.next_image)

        self.save_btn.clicked.connect(self.save_annotations)

        # Connect environment toggle
        self.env_toggle.clicked.connect(self.toggle_environment)

        # Connect line panel signals for immediate redraw
        self.line_panel.lineAnnotationChanged.connect(self.refresh_viewer)

        self.update_ui_state()

    ###########################################################################
    # ALERT MESSAGE HELPER
    ###########################################################################
    def show_alert(self, message, color="#F44336", timeout=3000):
        """
        Shows an alert in self.alert_label with the given background color
        for `timeout` milliseconds, then hides it automatically.
        """
        self.alert_label.setText(message)
        self.alert_label.setStyleSheet(f"""
            background-color: {color};
            color: #FFFFFF;
            border-radius: 6px;
            padding: 6px 10px;
            font-weight: bold;
        """)
        self.alert_label.setVisible(True)

        # Hide after `timeout` ms
        QTimer.singleShot(timeout, lambda: self.alert_label.setVisible(False))

    ###########################################################################
    # ENV TOGGLE LOGIC
    ###########################################################################
    def toggle_environment(self):
        if self.env_toggle.isChecked():
            # Outdoor
            self.env_toggle.setText("🌐 Outdoor Environment")
            self.env_toggle.setStyleSheet("QPushButton { background-color: black; color: white; }")
            self.logic.set_image_environment("Outdoor Environment")
        else:
            # Indoor
            self.env_toggle.setText("🏠 Indoor Environment")
            self.env_toggle.setStyleSheet("QPushButton { background-color: #F5F5DC; color: black; }")
            self.logic.set_image_environment("Indoor Environment")

        self.refresh_viewer()

    ###########################################################################
    # LOAD / SAVE / NAV
    ###########################################################################
    def refresh_viewer(self):
        self.line_panel.update_selections()
        self.update_image()

    def select_folder(self):
        folder_path = QFileDialog.getExistingDirectory(self, "Select a Folder")
        if folder_path:
            self.folder_label.setText(folder_path)

    def select_json(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self, "Select JSON File", "",
            "JSON Files (*.json);;All Files (*)"
        )
        if file_path:
            self.file_label.setText(file_path)
            self.logic.load_json_file(file_path)

    def load_images(self):
        folder_path = self.folder_label.text()
        if folder_path == "No Folder Selected":
            return
        try:
            self.logic.initialize_annotations_for_folder(folder_path)
        except ValueError as e:
            self.image_name_label.setText(str(e))
            return

        if self.logic.get_total_images() > 0:
            self.logic.current_image_index = 0
            self.update_image()
        else:
            self.image_name_label.setText("No images found in folder.")
        self.update_ui_state()

    def load_lines(self):
        self.update_image()

    def update_image(self):
        image_name = self.logic.get_current_image_name()
        if not image_name:
            self.image_name_label.setText("No Image Loaded")
            self.image_viewer.set_pixmap(QPixmap())
            return

        folder_path = self.folder_label.text()
        image_path = os.path.join(folder_path, image_name)
        pixmap = QPixmap(image_path)
        self.image_viewer.set_pixmap(pixmap)
        self.image_name_label.setText(image_name)

        # If environment is None, default to Indoor
        env = self.logic.get_image_environment()
        if env is None:
            self.env_toggle.setChecked(False)
            self.env_toggle.setText("🏠 Indoor Environment")
            self.env_toggle.setStyleSheet("QPushButton { background-color: #F5F5DC; color: black; }")
            self.logic.set_image_environment("Indoor Environment")
        else:
            if env == "Outdoor Environment":
                self.env_toggle.setChecked(True)
                self.env_toggle.setText("🌐 Outdoor Environment")
                self.env_toggle.setStyleSheet("QPushButton { background-color: black; color: white; }")
            else:
                self.env_toggle.setChecked(False)
                self.env_toggle.setText("🏠 Indoor Environment")
                self.env_toggle.setStyleSheet("QPushButton { background-color: #F5F5DC; color: black; }")

        self.line_panel.update_selections()
        self.update_progress_bars()

    def update_progress_bars(self):
        total_imgs = self.logic.get_total_images()
        current_idx = self.logic.current_image_index + 1
        self.image_progress.setMaximum(total_imgs if total_imgs else 1)
        self.image_progress.setValue(current_idx if total_imgs else 0)
        self.image_progress_label.setText(f"Image Progress: {current_idx}/{total_imgs}")

        total_lines = self.logic.get_current_line_count()
        annotated_lines = self.logic.get_annotated_line_count()
        self.line_progress.setMaximum(total_lines if total_lines else 1)
        self.line_progress.setValue(annotated_lines)
        self.line_progress_label.setText(f"Line Progress: {annotated_lines}/{total_lines}")

    def update_ui_state(self):
        pass

    ###########################################################################
    # Overridden line/image navigation to show custom alerts
    ###########################################################################
    def next_line(self):
        moved = self.logic.next_line()
        if not moved:
            self.show_alert("Please annotate the current line before moving to the next line!")
        self.refresh_viewer()

    def prev_line(self):
        moved = self.logic.previous_line()
        if not moved:
            self.show_alert("Please annotate the current line before moving to the previous line!")
        self.refresh_viewer()

    def next_image(self):
        moved = self.logic.next_image()
        if not moved:
            if self.logic.is_current_image_fully_annotated() and \
               self.logic.current_image_index == self.logic.get_total_images() - 1:
                self.image_name_label.setText("This is the last image!")
            else:
                self.show_alert("Fully annotate lines + environment before proceeding to the next image!")
            return
        self.update_image()

    def prev_image(self):
        moved = self.logic.previous_image()
        if not moved:
            self.image_name_label.setText("This is the first image!")
            return
        self.update_image()

    def save_annotations(self):
        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Save Annotations",
            "annotations_result.json",
            "JSON Files (*.json);;All Files (*)"
        )
        if file_path:
            self.logic.save_annotations(file_path)
            self.image_name_label.setText(f"Annotations saved to {file_path}")


def main():
    app = QApplication(sys.argv)
    window = LineAnnotationTool()
    window.show()
    sys.exit(app.exec_())   


if __name__ == "__main__":
    main()
