using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{


  /// <summary>
  /// Awake is called when the script instance is being loaded.
  /// </summary>
  private void Awake()
  {
    _inputs = new Controls();
    _root = new GameObject("CameraHelper").transform;
    _pivot = new GameObject("CameraPivot").transform;
    _target = new GameObject("CameraTarget").transform;
    _camera.orthographic = true;
    _camera.nearClipPlane = 0;
  }

  /// <summary>
  /// This function is called when the object becomes enabled and active.
  /// </summary>
  private void OnEnable()
  {
    _inputs.Enable();
    _inputs.Main.Move.started += _ => MoveStarted();
    _inputs.Main.Move.canceled += _ => MoveCanceled();
    _inputs.Main.TouchZoom.started += _ => ZoomStarted();
    _inputs.Main.TouchZoom.canceled += _ => ZoomCanceled();
  }

  /// <summary>
  /// This function is called when the behaviour becomes disabled or inactive.
  /// </summary>
  private void OnDisable()
  {
    _inputs.Disable();
    _inputs.Main.Move.started -= _ => MoveStarted();
    _inputs.Main.Move.canceled -= _ => MoveCanceled();
    _inputs.Main.TouchZoom.started -= _ => ZoomStarted();
    _inputs.Main.TouchZoom.canceled -= _ => ZoomCanceled();
  }

  private void MoveStarted()
  {
    _moving = true;
  }

  private void MoveCanceled()
  {
    _moving = false;
  }

  private void ZoomStarted()
  {
    Vector2 touch0 = _inputs.Main.TouchPosition0.ReadValue<Vector2>();
    Vector2 touch1 = _inputs.Main.TouchPosition0.ReadValue<Vector2>();
    _zoomPositionOnScreen = Vector2.Lerp(touch0, touch1, 0.5f);
    _zoomPositionInWorld = CameraScreenPositionToPlanePosition(_zoomPositionOnScreen);
    _zoomBaseValue = _zoom;

    touch0.x /= Screen.width;
    touch1.x /= Screen.width;

    touch0.y /= Screen.height;
    touch1.y /= Screen.height;

    _zoomBaseDistance = Vector2.Distance(touch0, touch1);

    _zooming = true;
  }

  private void ZoomCanceled()
  {
    _zooming = false;
  }

  /// <summary>
  /// Start is called before the first frame update.
  /// </summary>
  private void Start()
  {
    Initialize(Vector3.zero, 40, 40, 40, 40, 45, 10, 5, 20);
  }

  /// <summary>
  /// Initializes the camera controller with the specified parameters.
  /// </summary>
  /// <param name="center">The center position of the camera.</param>
  /// <param name="right">The distance to the right from the center.</param>
  /// <param name="left">The distance to the left from the center.</param>
  /// <param name="up">The distance to the top from the center.</param>
  /// <param name="down">The distance to the bottom from the center.</param>
  /// <param name="angle">The angle of the camera.</param>
  /// <param name="zoom">The initial zoom level.</param>
  /// <param name="zoomMin">The minimum zoom level.</param>
  /// <param name="zoomMax">The maximum zoom level.</param>
  public void Initialize(Vector3 center, float right, float left, float up, float down, float angle, float zoom, float zoomMin, float zoomMax)
  {
    _center = center;
    _left = left;
    _right = right;
    _up = up;
    _down = down;
    _moving = false;
    _angle = angle;
    _pivot.SetParent(_root);
    _target.SetParent(_pivot);
    _zoom = zoom;
    _zoomMin = zoomMin;
    _zoomMax = zoomMax;

    _camera.orthographicSize = _zoom;

    _zooming = false;
    _root.position = center;
    _root.localEulerAngles = Vector3.zero;

    _pivot.localPosition = Vector3.zero;
    _pivot.localEulerAngles = new Vector3(_angle, 0, 0);

    _target.localPosition = new Vector3(0, 0, -100);
    _target.localEulerAngles = Vector3.zero;
  }

  /// <summary>
  /// Updates the camera controller based on user input and adjusts the camera bounds.
  /// </summary>
  private void Update()
  {
    if (Input.touchSupported == false)
    {
      float mouseScroll = _inputs.Main.MouseScroll.ReadValue<float>();

      if (mouseScroll > 0)
      {
        _zoom -= 8f * Time.deltaTime;
      }
      else if (mouseScroll < 0)
      {
        _zoom += 8f * Time.deltaTime;
      }
    }

    if (_zooming)
    {
      Vector2 touch0 = _inputs.Main.TouchPosition0.ReadValue<Vector2>();
      Vector2 touch1 = _inputs.Main.TouchPosition0.ReadValue<Vector2>();

      touch0.x /= Screen.width;
      touch1.x /= Screen.width;

      touch0.y /= Screen.height;
      touch1.y /= Screen.height;

      float currentDistance = Vector2.Distance(touch0, touch1);
      float deltaDistance = currentDistance - _zoomBaseDistance;

      _zoom = _zoomBaseValue - (deltaDistance * _zoomSpeed);

      Vector3 zoomCenter = CameraScreenPositionToPlanePosition(_zoomPositionOnScreen);
      _root.position += (_zoomPositionInWorld - zoomCenter);
    }
    else if (_moving)
    {
      Vector2 move = _inputs.Main.MoveDelta.ReadValue<Vector2>();
      if (move != Vector2.zero)
      {
        move.x /= Screen.width;
        move.y /= Screen.height;
        _root.position -= move.x * _root.right.normalized * _moveSpeed;
        _root.position -= _root.forward.normalized * move.y * _moveSpeed;
      }
    }

    AdjustBounds();

    if (_camera.orthographicSize != _zoom)
    {
      _camera.orthographicSize = Mathf.Lerp(_camera.orthographicSize, _zoom, _zoomSmooth * Time.deltaTime);
    }

    if (_camera.transform.position != _target.position)
    {
      _camera.transform.position = Vector3.Lerp(_camera.transform.position, _target.position, _moveSmooth * Time.deltaTime);
    }

    if (_camera.transform.rotation != _target.rotation)
    {
      _camera.transform.rotation = _target.rotation;
    }
  }

  /// <summary>
  /// Adjusts the camera bounds based on the specified parameters.
  /// </summary>
  private void AdjustBounds()
  {
    if (_zoom < _zoomMin)
    {
      _zoom = _zoomMin;
    }

    if (_zoom > _zoomMax)
    {
      _zoom = _zoomMax;
    }

    float h = PlaneOrthographicSize();
    float w = h * _camera.aspect;

    if (h > (_up + _down) / 2f)
    {
      float n = (_up + _down) / 2f;
      _zoom = n * Mathf.Sin(_angle * Mathf.Deg2Rad);

    }
    if (w > (_right + _left) / 2f)
    {
      float n = (_right + _left) / 2f;
      _zoom = n * Mathf.Sin(_angle * Mathf.Deg2Rad) / _camera.aspect;
    }

    h = PlaneOrthographicSize();
    w = h * (_camera.aspect);

    Vector3 tr = _root.position + _root.right.normalized * w + _root.forward.normalized * h;
    Vector3 tl = _root.position - _root.right.normalized * w + _root.forward.normalized * h;

    Vector3 dr = _root.position + _root.right.normalized * w - _root.forward.normalized * h;
    Vector3 dl = _root.position - _root.right.normalized * w - _root.forward.normalized * h;

    if (tr.x > _center.x + _right)
    {
      _root.position += Vector3.left * Mathf.Abs(tr.x - (_center.x + _right));
    }

    if (tl.x < _center.x - _left)
    {
      _root.position += Vector3.right * Mathf.Abs((_center.x - _left) - tl.x);
    }


    if (tr.z > _center.z + _up)
    {
      _root.position += Vector3.back * Mathf.Abs(tr.z - (_center.z + _up));
    }

    if (tl.z < _center.z - _down)
    {
      _root.position += Vector3.forward * Mathf.Abs((_center.z - _down) - dl.z);
    }
  }

  /// <summary>
  /// Calculates the orthographic size of the camera's plane.
  /// </summary>
  /// <returns>The orthographic size of the camera's plane.</returns>
  private float PlaneOrthographicSize()
  {
    float h = _zoom * 2f;
    return h / Mathf.Sin(_angle * Mathf.Deg2Rad) / 2f;
  }

  /// <summary>
  /// Converts a screen position to a world position on the camera's plane.
  /// </summary>
  /// <param name="position">The screen position to convert.</param>
  /// <returns>The corresponding world position on the camera's plane.</returns>
  private Vector3 CameraScreenPositionToWorldPosition(Vector2 position)
  {
    // Calculate the height and width of the camera's plane
    float h = _camera.orthographicSize * 2f;
    float w = _camera.aspect * h;

    // Calculate the anchor point of the camera's plane
    Vector3 anchor = (_camera.transform.position - _camera.transform.right.normalized * w / 2f) - (_camera.transform.up.normalized * h / 2f);

    // Calculate the world position based on the screen position
    return anchor + (_camera.transform.right.normalized * position.x / Screen.width * w) + (_camera.transform.up.normalized * position.y / Screen.height * h);
  }

  /// <summary>
  /// Converts a screen position to a world position on the camera's plane.
  /// </summary>
  /// <param name="position">The screen position to convert.</param>
  /// <returns>The corresponding world position on the camera's plane.</returns>
  private Vector3 CameraScreenPositionToPlanePosition(Vector2 position)
  {
    // Convert the screen position to a world position on the camera's plane
    Vector3 point = CameraScreenPositionToWorldPosition(position);
    // Calculate the height of the camera's plane at the converted point
    float h = point.y - _root.position.y;
    // Calculate the distance from the camera to the converted point along the camera's forward direction
    float x = h / Mathf.Sin(_angle * Mathf.Deg2Rad);
    // Calculate the final world position by adding the distance along the camera's forward direction to the converted point
    return point + _camera.transform.forward.normalized * x;
  }
}