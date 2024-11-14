import cwiid
import time
import pyautogui
import threading

def connect_wiimotes():
    print("Press 1 + 2 on your first Wii Remote now to connect...")
    try:
        wiimote1 = cwiid.Wiimote()
        wiimote1.rpt_mode = cwiid.RPT_ACC
        print("First Wii Remote connected!")
        
        time.sleep(2)  # Short delay to separate the connections
        print("Press 1 + 2 on your second Wii Remote now to connect...")
        
        wiimote2 = cwiid.Wiimote()
        wiimote2.rpt_mode = cwiid.RPT_ACC
        print("Second Wii Remote connected!")
        
        return wiimote1, wiimote2
    except RuntimeError:
        print("Failed to connect to one or both Wii Remotes. Try again.")
        return None, None

def is_within_tolerance(value, target, tolerance=5):
    return target - tolerance <= value <= target + tolerance

def show_acceleration(wiimote, duration=50, key_to_press='2'):
    sequence = [125, 150, 125, 100]
    tolerance = 1
    current_index = 0
    counter = 0
    start_time = time.time()
    
    while time.time() - start_time < duration:
        acc = wiimote.state['acc']
        x = acc[0]
        
        if is_within_tolerance(x, sequence[current_index], tolerance):
            current_index += 1
            print(f"Detected sequence step for key {key_to_press}")
            if current_index == len(sequence):
                counter += 1
                print(f"Sequence completed for key {key_to_press}. Counter: {counter}")
                pyautogui.press(key_to_press)  # Key press here
                
                # Reset sequence
                current_index = 0

        print(f"Wii Remote {key_to_press} - X: {x}, Counter: {counter}")
        time.sleep(0.1)  # Sample rate

    print(f"Acceleration monitoring complete for Wii Remote {key_to_press}. Final counter: {counter}")

if __name__ == "__main__":
    wiimote1, wiimote2 = connect_wiimotes()
    if wiimote1 and wiimote2:
        thread1 = threading.Thread(target=show_acceleration, args=(wiimote1, 50, '2'))
        thread2 = threading.Thread(target=show_acceleration, args=(wiimote2, 50, '3'))
        
        thread1.start()
        thread2.start()
        
        thread1.join()
        thread2.join()
        
        wiimote1.close()
        wiimote2.close()
    else:
        print("Unable to connect to both Wii Remotes.")






