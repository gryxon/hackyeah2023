import os
import argparse
import logging
import shutil

from PIL import Image

LOGGER = logging.getLogger("DINO_CUT")


def cut_image_to_pieces(src_image_path):
    path_os = os.path.abspath(src_image_path)
    file_name = os.path.basename(src_image_path)
    file_name_no_extension = os.path.splitext(src_image_path)[0]
    path_for_dir_cuts = os.path.join(os.getcwd(), file_name_no_extension)
    try:
        shutil.rmtree(path_for_dir_cuts)
    except FileNotFoundError:
        pass    
    os.mkdir(path_for_dir_cuts)
    try:
        with Image.open(src_image_path) as src_img:
            width, height = src_img.size
            sub_width = width // 4
            sub_height = height // 4
            sub_images = {}
            for i in range(4):
                for j in range(4):
                    left = i * sub_width
                    upper = j * sub_height
                    right = (i + 1) * sub_width
                    lower = (j + 1) * sub_height
                    sub_image = src_img.crop((left, upper, right, lower))
                    sub_images[(i,j)] = sub_image
            for key in sub_images:
                sub_images[key].save(
                    os.path.join(path_for_dir_cuts, f'{key[1]}_{key[0]}.jpg')
                )
                Image.new('RGB', (sub_width, sub_height), color = (132,135,140)).save(
                    os.path.join(path_for_dir_cuts, '3_3.jpg')
                )
    except FileNotFoundError:
        LOGGER.error("Invalid path or filename.")



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--src_img", help="Path to source image.", required=True)
    args = parser.parse_args()
    cut_image_to_pieces(args.src_img)