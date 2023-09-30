import os
import argparse
import logging
import shutil
from PIL import Image

LOGGER = logging.getLogger("DINO_CUT")


def cut_image_to_pieces(src_image_path, num_rows, num_cols):
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
            sub_width = width // num_cols
            sub_height = height // num_rows
            sub_images = {}
            for i in range(num_cols):
                for j in range(num_rows):
                    left = i * sub_width
                    upper = j * sub_height
                    right = (i + 1) * sub_width
                    lower = (j + 1) * sub_height
                    sub_image = src_img.crop((left, upper, right, lower))
                    sub_images[(i,j)] = sub_image
            last_subimage = None
            for key in sub_images:
                sub_image_filename = f'{key[1]}_{key[0]}.jpg'
                sub_images[key].save(
                    os.path.join(path_for_dir_cuts, sub_image_filename)
                )
                last_subimage = sub_image_filename
            Image.new('RGB', (sub_width, sub_height), color = (0,0,0)).save(
                os.path.join(path_for_dir_cuts, last_subimage)
            )
    except FileNotFoundError:
        LOGGER.error("Invalid path or filename.")



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--src_img", help="Path to source image.", required=True)
    parser.add_argument("--num_rows", help="Number of rows after cropping.", required=True)
    parser.add_argument("--num_cols", help="Number of cols after cropping.", required=True)
    args = parser.parse_args()
    cut_image_to_pieces(args.src_img, int(args.num_rows), int(args.num_cols))
