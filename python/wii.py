import cwiid
import time

def count_rotations():
    # Connect to Wii Remote
    print("Press 1+2 on your Wii Remote now to connect...")
    time.sleep(1)
    try:
        wii = cwiid.Wiimote()
    except RuntimeError:
        print("Failed to connect to the Wii Remote. Please try again.")
        return

    # Enable buttons and MotionPlus if available
    wii.rpt_mode = cwiid.RPT_BTN | cwiid.RPT_EXT

    # Check if MotionPlus is present and enable it
    if 'ext_type' in wii.state and wii.state['ext_type'] == cwiid.EXT_MOTIONPLUS:
        wii.enable(cwiid.FLAG_MOTIONPLUS)
        print("Wii MotionPlus enabled.")
    else:
        print("MotionPlus not detected. Exiting.")
        return

    # Initialize variables for rotation counting
    rotation_count = 0
    rotation_accumulated = 0  # Accumulated rotation angle
    rotation_threshold = 360  # Degrees for one full rotation
    sensitivity_threshold = 5  # Minimum angular speed to consider rotation

    try:
        print("Counting rotations... Press 'Home' button on Wii Remote to quit.")
        while True:
            # Check if MotionPlus data is available
            if 'motionplus' in wii.state:
                gyro = wii.state['motionplus']
                # Using the 'z' axis (yaw) for rotation counting
                rotation_speed = gyro['z']

                # Only accumulate if rotation speed exceeds sensitivity threshold
                if abs(rotation_speed) > sensitivity_threshold:
                    # Accumulate rotation angle based on speed and time elapsed
                    rotation_accumulated += rotation_speed * 0.1  # Scale by 0.1 for time step

                    # Check if accumulated rotation completes a full 360-degree rotation
                    if abs(rotation_accumulated) >= rotation_threshold:
                        rotation_count += 1
                        rotation_accumulated = 0  # Reset accumulated rotation
                        print(f"Rotation detected! Total rotations: {rotation_count}")

            # Exit if the Home button is pressed
            if wii.state['buttons'] & cwiid.BTN_HOME:
                print("Exiting rotation counter.")
                break

            # Short delay for stability
            time.sleep(0.1)

    except KeyboardInterrupt:
        print("Interrupted by user.")

    finally:
        # Disconnect the Wii Remote
        wii.close()
        print(f"Total rotations counted: {rotation_count}")

if __name__ == "__main__":
    count_rotations()

