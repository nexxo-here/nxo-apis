import sys
import insightface
import cv2
import numpy as np
import uuid
import os

def read_image(path):
    img = cv2.imread(path)
    return img

def main():
    src_path = sys.argv[1]
    dst_path = sys.argv[2]
    output_path = sys.argv[3]

    app = insightface.app.FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
    app.prepare(ctx_id=0)

    src_img = read_image(src_path)
    dst_img = read_image(dst_path)

    swapper = insightface.model_zoo.get_model('inswapper_128.onnx', download=True, providers=["CPUExecutionProvider"])
    faces_src = app.get(src_img)
    faces_dst = app.get(dst_img)

    if not faces_src or not faces_dst:
        print("No face found", file=sys.stderr)
        exit(1)

    face_src = faces_src[0]
    face_dst = faces_dst[0]

    swapped = swapper.get(dst_img, face_dst, face_src, paste_back=True)

    cv2.imwrite(output_path, swapped)
    print(output_path)

if __name__ == '__main__':
    main()
